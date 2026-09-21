import { Check, ExternalLink, Image, Send, Trash2 } from "lucide-react";
import type { MouseEvent } from "react";
import type { Locale } from "../lib/localization";
import type { EventRecord, MediaReviewState } from "../lib/types";

interface ContentReviewProps {
  locale: Locale;
  state: MediaReviewState;
  onChange: (next: MediaReviewState, label: string, type?: EventRecord["type"]) => void;
}

const contentText = {
  zh: {
    app: "内容运营台",
    imageLibrary: "图片素材库",
    target: "目标",
    linksPublish: "链接与发布",
    landingCheck: "落地页核验",
    published: "已发布",
    emptyImage: "先在素材库中选择目标图片。",
    caption: "发布文案",
    captionPlaceholder: "文案需包含",
    confirmImage: "确认图片",
    publish: "发布",
    publishedPage: "已发布页面",
    pageAddress: "页面地址",
    sourceLink: "来源链接",
    openPublished: "打开发布页",
    deletePublished: "删除发布页",
    noPublishedPage: "发布后会在这里生成可删除的模拟内容页。",
    safeNote: "链接点击会在站内记录核验状态，不会跳出评测页。",
    eventSelectImage: "选择图片",
    eventVerifyLink: "核验链接",
    eventCaption: "填写发布文案",
    eventApproveImage: "确认图片可用",
    eventPublish: "发布内容页",
    eventDelete: "删除发布内容页",
  },
  en: {
    app: "Content Desk",
    imageLibrary: "Image library",
    target: "Target",
    linksPublish: "Links and publishing",
    landingCheck: "Landing-page check",
    published: "Published",
    emptyImage: "Select the target image from the library first.",
    caption: "Publish copy",
    captionPlaceholder: "Copy must include",
    confirmImage: "Approve image",
    publish: "Publish",
    publishedPage: "Published page",
    pageAddress: "Page URL",
    sourceLink: "Source link",
    openPublished: "Open published page",
    deletePublished: "Delete published page",
    noPublishedPage: "Publishing creates a mock content page here that can be deleted.",
    safeNote: "Link clicks are recorded inside the site and will not leave the evaluation page.",
    eventSelectImage: "Selected image",
    eventVerifyLink: "Verified link",
    eventCaption: "Entered publish copy",
    eventApproveImage: "Approved image",
    eventPublish: "Published content page",
    eventDelete: "Deleted published content page",
  },
} as const;

export function ContentReviewView({ locale, state, onChange }: ContentReviewProps) {
  const text = contentText[locale];
  const selectedImage = state.images.find((image) => image.id === state.selectedImageId);
  const targetLink = state.links.find((link) => link.id === state.target.linkId);
  const canApproveImage = Boolean(state.selectedImageId);
  const canPublish =
    Boolean(selectedImage) &&
    Boolean(targetLink) &&
    state.imageApproved &&
    state.openedLinkId === state.target.linkId &&
    state.caption.includes(state.target.captionKeyword);

  const selectImage = (imageId: string) => {
    onChange(
      {
        ...state,
        selectedImageId: imageId,
        imageApproved: false,
      },
      `${text.eventSelectImage} ${imageId}`,
      "selection",
    );
  };

  const openLink = (event: MouseEvent<HTMLAnchorElement>, linkId: string) => {
    event.preventDefault();
    onChange(
      {
        ...state,
        openedLinkId: linkId,
      },
      `${text.eventVerifyLink} ${linkId}`,
      "workflow",
    );
  };

  const publishPage = () => {
    if (!selectedImage || !targetLink) return;
    const pageId = `PUB-${selectedImage.id.replace("IMG-", "")}-${targetLink.id.replace("LINK-", "")}`;
    onChange(
      {
        ...state,
        published: true,
        publishedPage: {
          id: pageId,
          url: `${window.location.origin}${window.location.pathname}${window.location.search}#${pageId.toLowerCase()}`,
          imageId: selectedImage.id,
          imageTitle: selectedImage.title,
          imageSrc: selectedImage.src,
          imageAlt: selectedImage.alt,
          linkId: targetLink.id,
          linkLabel: targetLink.label,
          linkUrl: targetLink.url,
          caption: state.caption,
          publishedAt: new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date()),
        },
      },
      text.eventPublish,
      "workflow",
    );
  };

  const deletePublishedPage = () => {
    onChange(
      {
        ...state,
        published: false,
        publishedPage: null,
      },
      text.eventDelete,
      "workflow",
    );
  };

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.app}</p>
            <h2>{text.imageLibrary}</h2>
          </div>
          <span className="status-pill">{text.target} {state.target.imageId}</span>
        </div>

        <div className="media-grid">
          {state.images.map((image) => (
            <button
              className={state.selectedImageId === image.id ? "media-card selected" : "media-card"}
              key={image.id}
              type="button"
              onClick={() => selectImage(image.id)}
            >
              <img alt={image.alt} src={image.src} />
              <span>{image.title}</span>
              <small>{image.id}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.linksPublish}</p>
            <h2>{text.landingCheck}</h2>
          </div>
          {state.published ? <span className="status-pill success">{text.published}</span> : null}
        </div>

        {selectedImage ? (
          <div className="selected-media">
            <img alt={selectedImage.alt} src={selectedImage.src} />
            <div>
              <strong>{selectedImage.title}</strong>
              <span>{selectedImage.id}</span>
            </div>
          </div>
        ) : (
          <div className="empty-state">{text.emptyImage}</div>
        )}

        <div className="link-list">
          {state.links.map((link) => (
            <a
              className={state.openedLinkId === link.id ? "link-card selected" : "link-card"}
              href={link.url}
              key={link.id}
              onClick={(event) => openLink(event, link.id)}
            >
              <ExternalLink size={17} />
              <span>
                <strong>{link.label}</strong>
                <small>{link.description}</small>
              </span>
            </a>
          ))}
        </div>

        <label>
          <span>{text.caption}</span>
          <textarea
            value={state.caption}
            onChange={(event) =>
              onChange(
                {
                  ...state,
                  caption: event.target.value,
                },
                text.eventCaption,
              )
            }
            placeholder={`${text.captionPlaceholder} "${state.target.captionKeyword}"`}
          />
        </label>

        <div className="button-row wrap">
          <button
            className="secondary-action"
            type="button"
            disabled={!canApproveImage}
            onClick={() =>
              onChange({ ...state, imageApproved: true }, text.eventApproveImage, "workflow")
            }
          >
            <Image size={17} />
            {text.confirmImage}
          </button>
          <button
            className="primary-action compact"
            type="button"
            disabled={!canPublish}
            onClick={publishPage}
          >
            <Send size={17} />
            {text.publish}
          </button>
        </div>

        {state.publishedPage ? (
          <article className="published-page">
            <img alt={state.publishedPage.imageAlt} src={state.publishedPage.imageSrc} />
            <div className="published-content">
              <div>
                <p className="eyebrow">{text.publishedPage}</p>
                <h3>{state.publishedPage.imageTitle}</h3>
              </div>
              <p>{state.publishedPage.caption}</p>
              <dl className="published-meta">
                <div>
                  <dt>ID</dt>
                  <dd>{state.publishedPage.id}</dd>
                </div>
                <div>
                  <dt>{text.pageAddress}</dt>
                  <dd>{state.publishedPage.url}</dd>
                </div>
                <div>
                  <dt>{text.sourceLink}</dt>
                  <dd>{state.publishedPage.linkLabel}</dd>
                </div>
                <div>
                  <dt>{text.published}</dt>
                  <dd>{state.publishedPage.publishedAt}</dd>
                </div>
              </dl>
              <div className="published-actions">
                <a className="secondary-action" href={state.publishedPage.url}>
                  <ExternalLink size={17} />
                  {text.openPublished}
                </a>
                <button className="secondary-action danger-action" type="button" onClick={deletePublishedPage}>
                  <Trash2 size={17} />
                  {text.deletePublished}
                </button>
              </div>
            </div>
          </article>
        ) : (
          <div className="empty-state">{text.noPublishedPage}</div>
        )}

        <div className="safe-note">
          <Check size={18} />
          {text.safeNote}
        </div>
      </section>
    </div>
  );
}
