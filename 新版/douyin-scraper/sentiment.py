"""
基于情感词典的中文评论情感分析模块
"""

import re
import jieba
from config import POSITIVE_WORDS, NEGATIVE_WORDS


class SentimentAnalyzer:
    """简易情感分析器，基于积极/消极词库匹配"""

    def __init__(self):
        self.positive_set = set(POSITIVE_WORDS)
        self.negative_set = set(NEGATIVE_WORDS)

    def tokenize(self, text: str) -> list:
        """分词"""
        return list(jieba.cut(text))

    def is_positive(self, text: str) -> bool:
        """
        判断评论文本是否积极。
        规则：积极词数 > 消极词数 即视为积极。
        """
        if not text or not text.strip():
            return False

        tokens = self.tokenize(text)
        pos_count = sum(1 for w in tokens if w in self.positive_set)
        neg_count = sum(1 for w in tokens if w in self.negative_set)

        # 积极词多于消极词即判定为积极评论
        return pos_count > neg_count

    def get_sentiment_score(self, text: str) -> int:
        """
        返回情感得分：积极词数 - 消极词数
        正数 = 积极，零/负数 = 非积极
        """
        if not text or not text.strip():
            return 0
        tokens = self.tokenize(text)
        pos = sum(1 for w in tokens if w in self.positive_set)
        neg = sum(1 for w in tokens if w in self.negative_set)
        return pos - neg

    def filter_positive(self, comments: list) -> list:
        """从评论列表中筛选积极评论，附带得分"""
        result = []
        for c in comments:
            text = c.get("text", "")
            score = self.get_sentiment_score(text)
            if score > 0:
                c["sentiment_score"] = score
                result.append(c)
        return result


# 简单自测
if __name__ == "__main__":
    sa = SentimentAnalyzer()
    test_comments = [
        {"text": "向英雄致敬！你们是最可爱的人"},
        {"text": "太让人感动了，支持正能量"},
        {"text": "活该，都是虚伪的"},
        {"text": "保护历史遗迹，人人有责"},
        {"text": "呵呵，作秀罢了"},
    ]
    positive = sa.filter_positive(test_comments)
    print(f"共 {len(test_comments)} 条评论，筛选出 {len(positive)} 条积极评论：")
    for p in positive:
        print(f"  [{p['sentiment_score']}] {p['text']}")
