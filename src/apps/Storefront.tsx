import { PackageCheck, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import type { Locale } from "../lib/localization";
import type { EventRecord, StorefrontState } from "../lib/types";

interface StorefrontProps {
  locale: Locale;
  state: StorefrontState;
  onChange: (next: StorefrontState, label: string, type?: EventRecord["type"]) => void;
}

const storefrontText = {
  zh: {
    app: "电商前台",
    productSearch: "商品搜索",
    coupon: "优惠码",
    searchPlaceholder: "试试",
    searching: "搜索中...",
    searchProducts: "搜索商品",
    loading: "正在加载匹配商品和库存...",
    stock: "库存",
    select: "选择",
    emptySearch: "先搜索商品目录，再选择商品。",
    checkout: "结账",
    cartDetail: "购物车详情",
    ordered: "已下单",
    color: "颜色",
    size: "规格",
    quantity: "数量",
    recipient: "收件人",
    address: "收货地址",
    addressPlaceholder: "街道、城市、邮编",
    addCart: "加入购物车",
    submitOrder: "提交订单",
    emptyCart: "选择商品后配置规格并结账。",
    eventSearchCatalog: "搜索商品目录",
    eventQuery: "填写商品搜索词",
    eventSelectProduct: "选择商品",
    eventColor: "选择颜色",
    eventSize: "选择规格",
    eventQuantity: "修改数量",
    eventCoupon: "填写优惠码",
    eventRecipient: "填写收件人",
    eventAddress: "填写收货地址",
    eventAddCart: "加入购物车",
    eventSubmitOrder: "提交订单",
  },
  en: {
    app: "Storefront",
    productSearch: "Product search",
    coupon: "Coupon",
    searchPlaceholder: "Try",
    searching: "Searching...",
    searchProducts: "Search products",
    loading: "Loading matching products and inventory...",
    stock: "Stock",
    select: "Select",
    emptySearch: "Search the catalog first, then select a product.",
    checkout: "Checkout",
    cartDetail: "Cart details",
    ordered: "Order placed",
    color: "Color",
    size: "Size",
    quantity: "Quantity",
    recipient: "Recipient",
    address: "Shipping address",
    addressPlaceholder: "Street, city, postal code",
    addCart: "Add to cart",
    submitOrder: "Submit order",
    emptyCart: "Select a product, configure variants, then check out.",
    eventSearchCatalog: "Searched product catalog",
    eventQuery: "Entered product search term",
    eventSelectProduct: "Selected product",
    eventColor: "Selected color",
    eventSize: "Selected size",
    eventQuantity: "Changed quantity",
    eventCoupon: "Entered coupon",
    eventRecipient: "Entered recipient",
    eventAddress: "Entered shipping address",
    eventAddCart: "Added to cart",
    eventSubmitOrder: "Submitted order",
  },
} as const;

const searchAliases: Record<string, string[]> = {
  背包: ["backpack", "backpacks", "travel backpack"],
  办公: ["office", "office supplies", "workspace"],
  厨房: ["kitchen", "kitchenware"],
  弧线旅行背包: ["arc travel backpack"],
  专注护眼台灯: ["focus desk lamp", "desk lamp"],
  保温马克杯: ["thermal mug", "travel mug"],
  石墨黑: ["graphite black"],
  蕨叶绿: ["fern green"],
  云白: ["cloud white"],
  黑色: ["black"],
  白色: ["white"],
  鼠尾草绿: ["sage green"],
  陶土色: ["terracotta"],
  蓝色: ["blue"],
  钢色: ["steel"],
};

function searchableProductText(product: StorefrontState["products"][number]): string {
  return [
    product.name,
    product.category,
    product.id,
    ...product.name.split(" ").flatMap((part) => searchAliases[part] ?? []),
    ...(searchAliases[product.name] ?? []),
    ...(searchAliases[product.category] ?? []),
  ].join(" ").toLowerCase();
}

export function StorefrontView({ locale, state, onChange }: StorefrontProps) {
  const text = storefrontText[locale];
  const [isSearching, setIsSearching] = useState(false);
  const products = state.searched ? state.products.filter((product) => {
    return searchableProductText(product).includes(state.query.trim().toLowerCase());
  }) : [];
  const selectedProduct = state.products.find((product) => product.id === state.selectedProductId);
  const canSearch = state.query.trim().length > 0;
  const canAddToCart =
    Boolean(selectedProduct) &&
    state.color.length > 0 &&
    state.size.length > 0 &&
    state.quantity >= 1 &&
    state.quantity <= (selectedProduct?.stock ?? 0);
  const canSubmitOrder =
    canAddToCart &&
    state.cartAdded &&
    state.coupon.trim().toUpperCase() === state.target.coupon &&
    state.recipient.trim().length > 0 &&
    state.address.trim().length >= 10;

  const submitSearch = () => {
    setIsSearching(true);
    window.setTimeout(() => {
      setIsSearching(false);
      onChange(
        { ...state, searched: true, selectedProductId: null, cartAdded: false, orderPlaced: false },
        text.eventSearchCatalog,
        "workflow",
      );
    }, 600);
  };

  return (
    <div className="workspace-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.app}</p>
            <h2>{text.productSearch}</h2>
          </div>
          <span className="status-pill">{text.coupon} {state.target.coupon}</span>
        </div>

        <label className="search-field full">
          <Search size={17} />
          <input
            value={state.query}
            onChange={(event) =>
              onChange(
                {
                  ...state,
                  query: event.target.value,
                  searched: false,
                  selectedProductId: null,
                  cartAdded: false,
                  orderPlaced: false,
                },
                text.eventQuery,
              )
            }
            placeholder={`${text.searchPlaceholder} "${state.target.query}"`}
          />
        </label>
        <div className="toolbar">
          <button className="secondary-action" type="button" disabled={!canSearch || isSearching} onClick={submitSearch}>
            <Search size={17} />
            {isSearching ? text.searching : text.searchProducts}
          </button>
        </div>

        {isSearching ? <div className="loading-line">{text.loading}</div> : null}

        {state.searched ? (
          <div className="product-grid">
            {products.map((product) => (
              <article
                className={state.selectedProductId === product.id ? "product-card selected" : "product-card"}
                key={product.id}
              >
                <div className="product-visual" aria-hidden="true">
                  {product.name.slice(0, 2)}
                </div>
                <p className="eyebrow">{product.id}</p>
                <h3>{product.name}</h3>
                <p>{product.category} · {text.stock} {product.stock}</p>
                <strong>${product.price}</strong>
                <button
                  className="secondary-action"
                  type="button"
                  onClick={() =>
                    onChange(
                      {
                        ...state,
                        selectedProductId: product.id,
                        color: product.colors[0],
                        size: product.sizes[0],
                        quantity: 1,
                        cartAdded: false,
                        orderPlaced: false,
                      },
                      `${text.eventSelectProduct} ${product.id}`,
                      "selection",
                    )
                  }
                >
                  {text.select}
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">{text.emptySearch}</div>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">{text.checkout}</p>
            <h2>{text.cartDetail}</h2>
          </div>
          {state.orderPlaced ? <span className="status-pill success">{text.ordered}</span> : null}
        </div>

        {selectedProduct ? (
          <>
            <div className="selected-summary">
              <strong>{selectedProduct.name}</strong>
              <span>{selectedProduct.id}</span>
            </div>
            <div className="form-grid two">
              <label>
                <span>{text.color}</span>
                <select
                  value={state.color}
                  onChange={(event) =>
                    onChange(
                      {
                        ...state,
                        color: event.target.value,
                        cartAdded: false,
                        orderPlaced: false,
                      },
                      text.eventColor,
                    )
                  }
                >
                  {selectedProduct.colors.map((color) => (
                    <option key={color}>{color}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>{text.size}</span>
                <select
                  value={state.size}
                  onChange={(event) =>
                    onChange(
                      {
                        ...state,
                        size: event.target.value,
                        cartAdded: false,
                        orderPlaced: false,
                      },
                      text.eventSize,
                    )
                  }
                >
                  {selectedProduct.sizes.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>{text.quantity}</span>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={state.quantity}
                  onChange={(event) =>
                    onChange(
                      {
                        ...state,
                        quantity: Number(event.target.value),
                        cartAdded: false,
                        orderPlaced: false,
                      },
                      text.eventQuantity,
                    )
                  }
                />
              </label>
              <label>
                <span>{text.coupon}</span>
                <input
                  value={state.coupon}
                  onChange={(event) =>
                    onChange({ ...state, coupon: event.target.value, orderPlaced: false }, text.eventCoupon)
                  }
                  placeholder={state.target.coupon}
                />
              </label>
            </div>
            <label>
              <span>{text.recipient}</span>
              <input
                value={state.recipient}
                onChange={(event) =>
                  onChange({ ...state, recipient: event.target.value, orderPlaced: false }, text.eventRecipient)
                }
                placeholder={state.target.recipient}
              />
            </label>
            <label>
              <span>{text.address}</span>
              <textarea
                value={state.address}
                onChange={(event) =>
                  onChange({ ...state, address: event.target.value, orderPlaced: false }, text.eventAddress)
                }
                placeholder={text.addressPlaceholder}
              />
            </label>
            <div className="button-row">
              <button
                className="secondary-action"
                type="button"
                disabled={!canAddToCart}
                onClick={() => onChange({ ...state, cartAdded: true }, text.eventAddCart, "workflow")}
              >
                <ShoppingCart size={17} />
                {text.addCart}
              </button>
              <button
                className="primary-action compact"
                type="button"
                disabled={!canSubmitOrder}
                onClick={() =>
                  onChange({ ...state, cartAdded: true, orderPlaced: true }, text.eventSubmitOrder, "workflow")
                }
              >
                <PackageCheck size={17} />
                {text.submitOrder}
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">{text.emptyCart}</div>
        )}
      </section>
    </div>
  );
}
