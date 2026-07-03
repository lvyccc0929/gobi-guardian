"""
抖音评论爬虫核心模块
基于 Playwright 浏览器自动化，采集指定关键词相关视频的评论
"""

import asyncio
import csv
import json
import random
import time
from datetime import datetime
from pathlib import Path

from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.table import Table

from config import (
    SEARCH_KEYWORD,
    MAX_COMMENTS,
    MAX_COMMENTS_PER_VIDEO,
    MAX_SCROLLS,
    PAGE_LOAD_WAIT,
    REQUEST_INTERVAL,
    BROWSER_CONFIG,
    OUTPUT_CSV,
    OUTPUT_JSON,
)
from sentiment import SentimentAnalyzer

console = Console()


class DouyinScraper:
    """抖音评论爬虫"""

    def __init__(self):
        self.browser = None
        self.context = None
        self.page = None
        self.sentiment = SentimentAnalyzer()
        self.all_comments = []
        self.collected_count = 0

    async def init_browser(self):
        """初始化浏览器"""
        console.print("[cyan]正在启动浏览器...[/cyan]")
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=BROWSER_CONFIG["headless"],
        )
        self.context = await self.browser.new_context(
            viewport=BROWSER_CONFIG["viewport"],
            locale=BROWSER_CONFIG["locale"],
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        self.page = await self.context.new_page()
        console.print("[green]浏览器已启动[/green]")

    async def random_delay(self):
        """随机延迟，模拟人类操作"""
        delay = random.uniform(*REQUEST_INTERVAL)
        await asyncio.sleep(delay)

    async def search_videos(self):
        """搜索关键词并获取视频列表"""
        console.print(f"[cyan]正在搜索: {SEARCH_KEYWORD}[/cyan]")

        # 访问抖音搜索页
        search_url = f"https://www.douyin.com/search/{SEARCH_KEYWORD}?type=general"
        await self.page.goto(search_url, wait_until="domcontentloaded")
        await asyncio.sleep(PAGE_LOAD_WAIT)

        # 等待页面加载
        try:
            await self.page.wait_for_selector(
                '[data-e2e="search-content"]', timeout=15000
            )
        except PlaywrightTimeout:
            console.print("[yellow]搜索页面加载超时，尝试备用选择器...[/yellow]")
            try:
                await self.page.wait_for_selector(
                    'div[class*="search"]', timeout=10000
                )
            except PlaywrightTimeout:
                console.print("[red]无法加载搜索页面[/red]")
                return []

        # 滚动加载更多视频
        video_urls = []
        for i in range(MAX_SCROLLS):
            # 提取当前可见的视频链接
            current_urls = await self._extract_video_urls()
            for url in current_urls:
                if url not in video_urls:
                    video_urls.append(url)

            console.print(f"  滚动 {i + 1}/{MAX_SCROLLS}，已发现 {len(video_urls)} 个视频")

            # 滚动到底部
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await self.random_delay()

            if len(video_urls) >= 20:
                break

        console.print(f"[green]共发现 {len(video_urls)} 个相关视频[/green]")
        return video_urls

    async def _extract_video_urls(self):
        """从当前页面提取视频 URL"""
        urls = []
        try:
            # 尝试多种可能的 Douyin 视频卡片选择器
            selectors = [
                'a[href*="/video/"]',
                '[data-e2e="search-card"] a[href*="/video/"]',
                'div[class*="search-result-card"] a[href*="/video/"]',
            ]
            for selector in selectors:
                elements = await self.page.query_selector_all(selector)
                if elements:
                    for el in elements:
                        href = await el.get_attribute("href")
                        if href and "/video/" in href:
                            full_url = (
                                f"https://www.douyin.com{href}"
                                if href.startswith("/")
                                else href
                            )
                            urls.append(full_url)
                    break
        except Exception as e:
            console.print(f"[yellow]提取视频 URL 出错: {e}[/yellow]")
        return urls

    async def extract_comments_from_video(self, video_url: str) -> list:
        """从单个视频页面提取评论"""
        comments = []
        try:
            console.print(f"  [dim]正在处理视频: {video_url[:80]}...[/dim]")
            await self.page.goto(video_url, wait_until="domcontentloaded")
            await asyncio.sleep(PAGE_LOAD_WAIT)

            # 滚动评论区域加载更多评论
            for _ in range(10):
                try:
                    # 尝试滚动评论区域
                    await self.page.evaluate("""
                        const commentArea = document.querySelector(
                            '[class*="comment"]'
                        ) || document.body;
                        commentArea.scrollTop = commentArea.scrollHeight;
                    """)
                except Exception:
                    pass

                await self.random_delay()

                # 提取可见评论
                page_comments = await self._extract_visible_comments()
                for c in page_comments:
                    if c not in comments:
                        comments.append(c)

                if len(comments) >= MAX_COMMENTS_PER_VIDEO:
                    break

            console.print(f"    [dim]从该视频提取到 {len(comments)} 条评论[/dim]")

        except Exception as e:
            console.print(f"[yellow]处理视频出错: {e}[/yellow]")

        return comments

    async def _extract_visible_comments(self) -> list:
        """提取页面上当前可见的评论"""
        comments = []
        try:
            # Douyin 评论选择器（可能随版本变化）
            selectors = [
                '[data-e2e="comment-item"]',
                'div[class*="comment-item"]',
                'div[class*="CommentItem"]',
                'div[class*="comment-list"] > div',
            ]

            for selector in selectors:
                elements = await self.page.query_selector_all(selector)
                if elements:
                    for el in elements:
                        try:
                            text = await el.inner_text()
                            text = text.strip()
                            if text and len(text) >= 2:
                                comments.append({
                                    "text": text.replace("\n", " "),
                                    "timestamp": datetime.now().isoformat(),
                                })
                        except Exception:
                            continue
                    if comments:
                        break

        except Exception:
            pass

        return comments

    async def run(self):
        """主运行流程"""
        console.print()
        console.print("=" * 60)
        console.print("[bold cyan]  抖音积极评论爬虫[/bold cyan]")
        console.print(f"  搜索关键词: {SEARCH_KEYWORD}")
        console.print(f"  目标评论数: {MAX_COMMENTS}")
        console.print("=" * 60)
        console.print()

        try:
            await self.init_browser()

            # Step 1: 搜索视频
            video_urls = await self.search_videos()
            if not video_urls:
                console.print("[red]未找到相关视频，请检查关键词或网络连接[/red]")
                return []

            # Step 2: 遍历视频提取评论
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task(
                    f"采集评论中 (0/{MAX_COMMENTS})", total=MAX_COMMENTS
                )

                for url in video_urls:
                    if self.collected_count >= MAX_COMMENTS:
                        break

                    video_comments = await self.extract_comments_from_video(url)
                    self.all_comments.extend(video_comments)
                    self.collected_count = len(self.all_comments)

                    progress.update(
                        task,
                        completed=self.collected_count,
                        description=f"采集评论中 ({self.collected_count}/{MAX_COMMENTS})",
                    )

                    await self.random_delay()

            # Step 3: 情感分析筛选积极评论
            console.print()
            console.print("[cyan]正在进行情感分析...[/cyan]")
            positive_comments = self.sentiment.filter_positive(self.all_comments)
            console.print(
                f"[green]从 {len(self.all_comments)} 条评论中筛选出 "
                f"{len(positive_comments)} 条积极评论[/green]"
            )

            # Step 4: 保存结果
            self._save_results(positive_comments)

            return positive_comments

        except Exception as e:
            console.print(f"[red]运行出错: {e}[/red]")
            import traceback
            traceback.print_exc()
            return []

        finally:
            await self._cleanup()

    def _save_results(self, comments: list):
        """保存结果到 CSV 和 JSON"""
        if not comments:
            console.print("[yellow]没有积极评论可保存[/yellow]")
            return

        # 保存 CSV
        csv_path = Path(OUTPUT_CSV)
        with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(
                f, fieldnames=["text", "sentiment_score", "timestamp"]
            )
            writer.writeheader()
            for c in comments:
                writer.writerow({
                    "text": c.get("text", ""),
                    "sentiment_score": c.get("sentiment_score", 0),
                    "timestamp": c.get("timestamp", ""),
                })
        console.print(f"[green]CSV 已保存: {csv_path.absolute()}[/green]")

        # 保存 JSON
        json_path = Path(OUTPUT_JSON)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(comments, f, ensure_ascii=False, indent=2)
        console.print(f"[green]JSON 已保存: {json_path.absolute()}[/green]")

        # 打印摘要表格
        table = Table(title="积极评论摘要 (前10条)")
        table.add_column("#", style="dim")
        table.add_column("情感得分", style="cyan")
        table.add_column("评论内容", style="green")
        for i, c in enumerate(comments[:10], 1):
            table.add_row(str(i), str(c.get("sentiment_score", 0)), c.get("text", "")[:80])
        console.print(table)

    async def _cleanup(self):
        """清理资源"""
        if self.page:
            await self.page.close()
        if self.context:
            await self.context.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        console.print("[dim]浏览器已关闭[/dim]")


async def main():
    scraper = DouyinScraper()
    comments = await scraper.run()
    return comments


if __name__ == "__main__":
    asyncio.run(main())
