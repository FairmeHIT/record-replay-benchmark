#!/usr/bin/env node

import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const tempDir = await mkdtemp(path.join(os.tmpdir(), "record-replay-preflight-"));
const bundlePath = path.join(tempDir, "tasks.mjs");

try {
  await build({
    bundle: true,
    entryPoints: [path.join(root, "src/lib/tasks.ts")],
    format: "esm",
    outfile: bundlePath,
    platform: "node",
    logLevel: "silent",
  });

  const { cheapestMatchingTrain, tasks } = await import(
    `${pathToFileURL(bundlePath).href}?cacheBust=${Date.now()}`
  );

  const failures = [];
  const seeds = Array.from({ length: 30 }, (_, index) => index + 1);

  const completeState = (task, seed) => {
    const state = task.createState(seed);

    switch (state.kind) {
      case "profile-form":
        return {
          ...state,
          form: {
            ...state.form,
            name: state.target.name,
            email: state.target.email,
            country: state.target.country,
            role: state.target.role,
            budget: state.target.budget,
            newsletter: state.target.newsletter,
            accepted: true,
          },
          saved: true,
        };
      case "table-approval":
        return {
          ...state,
          selectedId: state.targetRequestId,
          rows: state.rows.map((row) =>
            row.id === state.targetRequestId ? { ...row, status: "approved" } : row,
          ),
          approvalComment: "已完成审批，资料符合要求",
        };
      case "ticket-booking": {
        const train = cheapestMatchingTrain(state);
        if (!train) {
          failures.push(`${task.id} seed=${seed}: no available matching train`);
          return state;
        }
        return {
          ...state,
          search: {
            origin: state.target.origin,
            destination: state.target.destination,
            date: state.target.date,
          },
          searched: true,
          filter: "all",
          selectedTrainId: train.id,
          passenger: state.target.passenger,
          captchaInput: String(state.target.captchaAnswer),
          order: {
            reference: `RR-${seed}-${train.id}`,
            trainId: train.id,
            passenger: state.target.passenger,
            status: "reserved",
          },
        };
      }
      case "storefront-checkout":
        return {
          ...state,
          query: state.target.query,
          searched: true,
          selectedProductId: state.target.productId,
          color: state.target.color,
          size: state.target.size,
          quantity: state.target.quantity,
          coupon: state.target.coupon,
          recipient: state.target.recipient,
          address: "测试地址 100 号，深圳市南山区",
          cartAdded: true,
          orderPlaced: true,
        };
      case "code-hosting":
        return {
          ...state,
          issue: {
            ...state.issue,
            title: state.target.issueTitle,
            body: "完成需求并补充验收说明",
            label: state.target.label,
            assignee: state.target.assignee,
            created: true,
          },
          pullRequest: {
            ...state.pullRequest,
            branch: state.target.branch,
            filePath: state.target.filePath,
            summary: "完成实现、测试与回放验收",
            opened: true,
            reviewed: true,
            checksPassed: true,
            merged: true,
          },
        };
      case "media-review": {
        const image = state.images.find((item) => item.id === state.target.imageId);
        const link = state.links.find((item) => item.id === state.target.linkId);
        if (!image || !link) {
          failures.push(`${task.id} seed=${seed}: media target is missing`);
          return state;
        }
        return {
          ...state,
          selectedImageId: image.id,
          openedLinkId: link.id,
          imageApproved: true,
          caption: `用于${state.target.captionKeyword}的活动内容`,
          published: true,
          publishedPage: {
            id: `PUB-${image.id.replace("IMG-", "")}-${link.id.replace("LINK-", "")}`,
            url: "https://example.test/published",
            imageId: image.id,
            imageTitle: image.title,
            imageSrc: image.src,
            imageAlt: image.alt,
            linkId: link.id,
            linkLabel: link.label,
            linkUrl: link.url,
            caption: `用于${state.target.captionKeyword}的活动内容`,
            publishedAt: "2026-09-21 09:00",
          },
        };
      }
      case "browser-lab":
        return {
          ...state,
          upload: {
            sampleDownloaded: true,
            fileName: state.target.sampleFileName,
            documentType: state.target.uploadType,
            parsed: true,
          },
          download: {
            format: state.target.reportFormat,
            generated: true,
            fileName: `browser-lab-report.${state.target.reportFormat.toLowerCase()}`,
          },
          dialogs: {
            alertAcknowledged: true,
            alertOpen: false,
            approvalInput: state.target.approvalCode,
            promptPassed: true,
            promptOpen: false,
            confirmAccepted: true,
            confirmOpen: false,
          },
          noise: {
            cookieBannerVisible: false,
            helperPanelVisible: false,
            surveyModalVisible: false,
          },
          selectedDocumentId: state.target.documentId,
          dragItems: state.target.dragOrder.map((id) => state.dragItems.find((item) => item.id === id)),
          memo: `资料${state.target.memoKeyword}`,
          submitted: true,
        };
      case "control-benchmark":
        return {
          ...state,
          form: {
            ...state.form,
            buttonNormalOk: true,
            buttonDelayedOk: true,
            buttonDoubleOk: true,
            textValue: state.target.textValue,
            passwordValue: state.target.passwordValue,
            textareaValue: "回放验证",
            textChanged: true,
            radioValue: state.target.radioValue,
            checkboxChecked: true,
            switchOn: state.target.switchOn,
            choiceDone: true,
            selectValue: state.target.selectValue,
            autocompleteValue: state.target.autocompleteValue,
            autocompleteDone: true,
            dateValue: state.target.dateValue,
            timeValue: "09:30",
            dateDone: true,
            tabActive: "tab2",
            accordionOpen: true,
            modalConfirmed: true,
            toastShown: true,
            treeOpen: true,
            sliderValue: state.target.sliderValue,
            sliderDone: true,
            dragCompleted: true,
            canvasClicked: true,
            svgClicked: true,
            shadowValue: state.target.shadowValue,
            shadowResult: "SHADOW_OK",
            scrollTargetFound: true,
            tableSorted: true,
            paginationPage: 4,
            paginationTargetFound: true,
            s1Name: state.target.scenarioName,
            s1Type: state.target.scenarioType,
            s1Date: state.target.scenarioDate,
            s1Result: "FORM_SCENE_OK",
            s3Region: state.target.scenarioRegion,
            s3Loaded: true,
            s3Result: "ASYNC_TABLE_OK",
            s4Page: 5,
            s4Result: "FOUND ORDER-X-042",
            s11Amount: state.target.scenarioAmount,
            s11Paid: true,
            s11DuplicateBlocked: true,
            s11TransactionId: `PAY-${seed}`,
            s11Result: `PAYMENT_MOCK_OK PAY-${seed}`,
            s12Shadow: true,
            s12Canvas: true,
            s12Svg: true,
            s12Result: "MIXED_UI_OK",
          },
        };
      default:
        return state;
    }
  };

  const difficultyCounts = Object.fromEntries(
    ["easy", "medium", "hard"].map((difficulty) => [
      difficulty,
      tasks.filter((task) => task.difficulty === difficulty).length,
    ]),
  );

  if (tasks.length !== 15) failures.push(`expected 15 tasks, found ${tasks.length}`);
  if (new Set(tasks.map((task) => task.id)).size !== tasks.length) {
    failures.push("task IDs are not unique");
  }
  const expectedCounts = { easy: 5, medium: 5, hard: 5 };
  for (const difficulty of ["easy", "medium", "hard"]) {
    if (difficultyCounts[difficulty] !== expectedCounts[difficulty]) {
      failures.push(`${difficulty} task count is ${difficultyCounts[difficulty]}, expected ${expectedCounts[difficulty]}`);
    }
  }

  for (const task of tasks) {
    for (const seed of seeds) {
      const state = completeState(task, seed);
      const evaluation = task.evaluate(state);
      if (!evaluation.success) {
        const pending = evaluation.checks.filter((check) => !check.passed).map((check) => check.id);
        failures.push(`${task.id} seed=${seed}: ${pending.join(", ") || "evaluation failed"}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error("Preflight failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`Preflight passed: ${tasks.length} tasks x ${seeds.length} seeds`);
    console.log(`Difficulty counts: easy=${difficultyCounts.easy}, medium=${difficultyCounts.medium}, hard=${difficultyCounts.hard}`);
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
