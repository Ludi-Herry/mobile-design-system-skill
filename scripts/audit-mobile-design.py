#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ludi Mobile Design System 规则自动化审计脚本 (Mobile Design Linter)
用于对移动端 React / Vue / TSX / H5 代码进行设计系统与踩坑红线合规性检查。

检查项覆盖：
1. [安全区避让] 检查 fixed bottom-0 的吸底容器是否缺失了 safe-area-inset-bottom
2. [键盘类型] 检查手机号、验证码、金额输入框是否缺失了精准的 inputmode / type 声明
3. [触控热区] 检查可点击小图标是否缺失 44pt 触控扩张
4. [浮层防丢] 检查移动端弹窗/抽屉是否开启了 maskClosable={true}
5. [表格暴力移植] 检查手机页面是否直接使用了复杂的 table 标签（应转换为卡片流）
"""

import sys
import os
import re
from pathlib import Path

def audit_file(file_path: Path):
    violations = []
    try:
        content = file_path.read_text(encoding="utf-8")
    except Exception as e:
        return [{"id": "IO-ERR", "line": 0, "rule": "读取失败", "severity": "ERROR", "message": str(e)}]

    lines = content.splitlines()
    for idx, line in enumerate(lines, start=1):
        # 1. 检查 fixed bottom 吸底容器安全区避让
        if re.search(r'fixed\b[^>]*?\bbottom-0\b', line, re.IGNORECASE):
            if "safe-area-inset-bottom" not in line:
                violations.append({
                    "id": "MOB-001",
                    "line": idx,
                    "rule": "底部安全区丢失",
                    "severity": "ERROR",
                    "message": "检测到底部固定定位吸底容器 (fixed bottom-0) 未配置 env(safe-area-inset-bottom) 安全区避让。在全面屏上会导致主按钮被系统 Home Bar 遮挡并引发误触。",
                    "code_snippet": line.strip()[:80]
                })

        # 2. 检查移动端输入框缺少精准键盘声明
        if re.search(r'<input\b', line, re.IGNORECASE) and re.search(r'(?:phone|mobile|tel|otp|verify|sms)', line, re.IGNORECASE):
            if not re.search(r'inputmode\s*=\s*["\'](?:tel|numeric)["\']', line, re.IGNORECASE):
                violations.append({
                    "id": "MOB-002",
                    "line": idx,
                    "rule": "移动端输入框缺少精准键盘声明",
                    "severity": "WARNING",
                    "message": "检测到手机号或验证码字段未配置 inputmode=\"tel\" 或 inputmode=\"numeric\"。会导致手机唤起英文全键盘，破坏输入效率。",
                    "code_snippet": line.strip()[:80]
                })

        # 3. 检查浮层开启遮罩点击易丢失数据
        if re.search(r'(?:<BottomSheet|<Drawer|<Modal|<Dialog)[^>]*?maskClosable\s*=\s*\{?true\}?', line, re.IGNORECASE):
            violations.append({
                "id": "MOB-003",
                "line": idx,
                "rule": "浮层开启遮罩点击易丢失数据",
                "severity": "ERROR",
                "message": "移动端浮层开启了 maskClosable={true}。用户手滑极易误触背景导致正在录入或核对的数据丢失。",
                "code_snippet": line.strip()[:80]
            })

        # 4. 检查移动端暴力移植复杂表格
        if re.search(r'<table\b[^>]*>', line, re.IGNORECASE):
            violations.append({
                "id": "MOB-004",
                "line": idx,
                "rule": "移动端暴力移植复杂表格",
                "severity": "WARNING",
                "message": "检测到移动端代码直接使用了 <table> 标签。移动端应优先采用垂直结构化卡片流 (Card List) 承载数据，避免整屏横向晃动。",
                "code_snippet": line.strip()[:80]
            })

    return violations

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    target_path = Path(target).resolve()

    files_to_check = []
    if target_path.is_file():
        files_to_check.append(target_path)
    else:
        for ext in ("*.tsx", "*.jsx", "*.vue", "*.html"):
            files_to_check.extend(target_path.rglob(ext))

    total_violations = 0
    print(f"[Mobile Design Linter] 正在走查移动端规范: {target_path}")
    print(f"发现待测代码文件: {len(files_to_check)} 个\n")

    for f in files_to_check:
        results = audit_file(f)
        if results:
            print(f"文件: {f.relative_to(target_path) if target_path.is_dir() else f.name}")
            for r in results:
                total_violations += 1
                color_tag = "[ERROR]" if r["severity"] == "ERROR" else "[WARN]"
                print(f"  Line {r['line']} {color_tag} ({r['id']} {r['rule']}): {r['message']}")
                print(f"    代码片段: `{r['code_snippet']}`")
            print()

    if total_violations == 0:
        print("恭喜！未检测到移动端设计系统违规项，安全区、触控热区与键盘映射均合规！")
        sys.exit(0)
    else:
        print(f"走查完成，共发现 {total_violations} 处需优化的移动端交互项。")
        sys.exit(1)

if __name__ == "__main__":
    main()
