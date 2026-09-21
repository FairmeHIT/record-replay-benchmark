#!/usr/bin/env python3
"""Run a minimal MiniWoB++ smoke test."""

from __future__ import annotations

import argparse
import sys
from typing import Any

import gymnasium
import miniwob
from miniwob.action import ActionTypes


def find_element_by_text(dom_elements: tuple[dict[str, Any], ...], text: str) -> dict[str, Any]:
    for element in dom_elements:
        if element.get("text") == text:
            return element
    raise LookupError(f"Could not find DOM element with text {text!r}")


def run_smoke(render_mode: str | None, seed: int, wait_ms: int) -> int:
    gymnasium.register_envs(miniwob)

    env = gymnasium.make(
        "miniwob/click-test-2-v1",
        render_mode=render_mode,
        wait_ms=wait_ms,
    )

    try:
        observation, _info = env.reset(seed=seed)
        target_text = observation["fields"][0][1]
        target = find_element_by_text(observation["dom_elements"], target_text)
        action = env.unwrapped.create_action(
            ActionTypes.CLICK_ELEMENT,
            ref=target["ref"],
        )

        _observation, reward, terminated, truncated, _info = env.step(action)
        success = terminated and not truncated and reward > 0

        print(f"task=miniwob/click-test-2-v1")
        print(f"seed={seed}")
        print(f"instruction={observation['utterance']}")
        print(f"target={target_text}")
        print(f"reward={reward:.3f}")
        print(f"success={success}")

        return 0 if success else 1
    finally:
        env.close()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--headed", action="store_true", help="show the browser window")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--wait-ms", type=int, default=150)
    args = parser.parse_args()

    render_mode = "human" if args.headed else None
    return run_smoke(render_mode=render_mode, seed=args.seed, wait_ms=args.wait_ms)


if __name__ == "__main__":
    sys.exit(main())
