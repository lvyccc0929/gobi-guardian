"""
抖音积极评论爬虫 - 入口文件

用法:
    python main.py                    # 默认运行
    python main.py --headless         # 无头模式（后台运行）
    python main.py --keyword "关键词"  # 自定义搜索关键词
"""

import asyncio
import argparse
import sys
from pathlib import Path

# 确保项目根目录在 sys.path 中
sys.path.insert(0, str(Path(__file__).parent))

from config import BROWSER_CONFIG, SEARCH_KEYWORD


async def run(keyword: str = None, headless: bool = None):
    """延迟导入，确保路径正确"""
    import config as cfg

    if keyword:
        cfg.SEARCH_KEYWORD = keyword
    if headless is not None:
        cfg.BROWSER_CONFIG["headless"] = headless

    from scraper import DouyinScraper

    scraper = DouyinScraper()
    comments = await scraper.run()

    if comments:
        print(f"\n✅ 成功采集 {len(comments)} 条积极评论")
    else:
        print("\n⚠️ 未采集到积极评论")

    return comments


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="抖音积极评论爬虫")
    parser.add_argument(
        "--keyword", "-k",
        type=str,
        default=None,
        help=f'搜索关键词（默认: "{SEARCH_KEYWORD}"）',
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        default=None,
        help="启用无头模式（不显示浏览器窗口）",
    )
    parser.add_argument(
        "--show",
        action="store_true",
        default=None,
        help="显示浏览器窗口",
    )
    args = parser.parse_args()

    # headless 优先级: --headless > --show 的反义 > 默认
    headless = None
    if args.headless:
        headless = True
    elif args.show:
        headless = False

    asyncio.run(run(keyword=args.keyword, headless=headless))
