import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { LuX, LuUsers } from "react-icons/lu";
import { usersService } from "../../services/Services";
import { useAlert } from "../../providers/AlertProvider";
import BrandLoader from "../../components/modals/BrandLoader";
import CancelButton from "../../constants/CancelButton";
import IconButton from "../../constants/IconButton";
import Section from "../Section";

const API_BASE = "http://localhost:3000";

export default function CustomersModal({ open, userId, onClose }) {
  const t = useTheme();
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;

    const fetchOne = async () => {
      setLoading(true);
      setUser(null);
      setOrders([]);
      setShowAllOrders(false);

      try {
        const res = await usersService.getUserById(userId);

        const payload = res?.data?.data;
        const u = payload?.user ? payload.user : payload;

        setUser(u);

        // ✅ ensure newest first (backend already sorts, but keep frontend safe)
        const list = Array.isArray(payload?.orders) ? payload.orders : [];
        
        setOrders(list);
      } catch (err) {
        showAlert(
          "error",
          err?.response?.data?.message || "Failed to load user details"
        );
        setUser(null);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [open, userId, showAlert]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const paidOrdersCount = useMemo(
    () => orders.filter((o) => o?.paid).length,
    [orders]
  );

  const visibleOrders = useMemo(() => {
    if (showAllOrders) return orders;
    return orders.slice(0, 3); // ✅ latest 3
  }, [orders, showAllOrders]);

  const hasMoreOrders = orders.length > 3;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="w-full max-w-7xl border shadow-xl overflow-hidden flex flex-col"
        style={{
          background: t.colors.surface,
          borderColor: t.colors.borderColor,
          borderRadius: t.radius.lg,
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: t.colors.borderColor }}
        >
          <div className="flex items-center gap-2">
            <LuUsers style={{ color: t.colors.primary }} />
            <div
              className="font-semibold"
              style={{ color: t.colors.textPrimary }}
            >
              Customer Details
            </div>
          </div>

          <IconButton onClick={onClose}>
            <LuX size={20} />
          </IconButton>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {loading && (
            <div className="py-10">
              <BrandLoader />
            </div>
          )}

          {!loading && !user && (
            <div style={{ color: t.colors.textSecondary }}>No data.</div>
          )}

          {!loading && user && (
            <div className="space-y-6">
              {/* Name */}
              <Section title="Name">
                <div
                  className="text-lg font-semibold"
                  style={{ color: t.colors.textPrimary }}
                >
                  {(user?.name || "-").toUpperCase()}
                </div>
              </Section>

              {/* Info grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                <Section title="Basic Info" className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <Info label="Email" value={user?.email} />
                    <Info label="Phone" value={user?.phone} />
                    <Info label="Role" value={user?.role || "user"} />
                    <Info
                      label="Two Factor"
                      value={user?.twoFactorEnabled ? "Enabled" : "Disabled"}
                    />
                    <Info label="Orders Count" value={String(orders.length)} />
                    <Info label="Paid Orders" value={String(paidOrdersCount)} />
                  </div>
                </Section>

                <Section title="Meta Info" className="lg:col-span-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    <Info
                      label="Wishlist Count"
                      value={String(user?.wishlist?.length ?? 0)}
                    />
                    <Info
                      label="Addresses Count"
                      value={String(user?.addresses?.length ?? 0)}
                    />
                    <Info label="Created At" value={formatDate(user?.createdAt)} />
                    <Info label="Updated At" value={formatDate(user?.updatedAt)} />
                  </div>
                </Section>
              </div>

              {/* Orders */}
              <Section title={`Orders (${orders.length})`}>
                {orders.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {visibleOrders.map((o) => (
                        <div
                          key={String(o?._id)}
                          className="border p-4"
                          style={{
                            borderColor: t.colors.borderColor,
                            borderRadius: t.radius.md,
                            background: "white",
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="min-w-0 ml-1">
                              <div
                                className="text-xs font-semibold"
                                style={{ color: t.colors.primary }}
                              >
                                Order ID
                              </div>
                              <div
                                className="text-sm font-bold truncate"
                                title={String(o?._id)}
                                style={{ color: t.colors.textPrimary }}
                              >
                                {String(o?._id)}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs">
                              <Badge text={o?.status ? "Status: " + o?.status : "-"} />
                              <Badge
                                text={
                                  o?.paid
                                    ? "Status of Payment: Paid"
                                    : "Status of Payment: Not Paid"
                                }
                              />
                              <Badge
                                text={
                                  o?.paymentMethod
                                    ? "Payment Method: " + o?.paymentMethod
                                    : "-"
                                }
                              />
                              <Badge text={formatDate(o?.createdAt || "-")} />
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Info
                              label="Items Count"
                              value={String(o?.items?.length ?? 0)}
                            />
                            <Info
                              label="Total Amount"
                              value={String(o?.totalAmount ?? "-")}
                            />
                            <Info
                              label="Address"
                              value={
                                o?.address
                                  ? `${o.address.fullAddress}, ${o.address.label} •
                            ${o.address.city} • ${o.address.country} • ${o.address.postalCode}`
                                  : "-"
                              }
                            />
                          </div>

                          {/* Products */}
                          <div className="mt-4">
                            <div
                              className="text-xs font-semibold mb-2"
                              style={{ color: t.colors.primary }}
                            >
                              Products
                            </div>

                            {Array.isArray(o?.items) && o.items.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {o.items.map((it, idx) => (
                                  <OrderProductCard
                                    key={`${String(o?._id)}-${idx}`}
                                    item={it}
                                    borderColor={t.colors.borderColor}
                                    radius={t.radius.md}
                                    textPrimary={t.colors.textPrimary}
                                    textSecondary={t.colors.textSecondary}
                                    primary={t.colors.primary}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div style={{ color: t.colors.textSecondary }}>
                                No items in this order.
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ✅ See more / show less */}
                    {hasMoreOrders && (
                      <div className="mt-4 flex justify-center">
                        <button
                          type="button"
                          className="border px-4 py-2 font-semibold"
                          style={{
                            borderColor: t.colors.borderColor,
                            borderRadius: t.radius.md,
                            background: "white",
                            color: t.colors.textPrimary,
                          }}
                          onClick={() => setShowAllOrders((v) => !v)}
                        >
                          {showAllOrders ? "Show Less" : "See More"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: t.colors.textSecondary }}>No orders.</div>
                )}
              </Section>

              {/* Addresses */}
              <Section title="Addresses">
                {Array.isArray(user?.addresses) && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {user.addresses.map((a, idx) => (
                      <div
                        key={`${a?.label || "addr"}-${idx}`}
                        className="border px-4 py-3"
                        style={{
                          borderColor: t.colors.borderColor,
                          borderRadius: t.radius.md,
                          background: "white",
                        }}
                      >
                        <div
                          className="text-xs font-semibold mb-1"
                          style={{ color: t.colors.primary }}
                        >
                          {a?.label || `Address ${idx + 1}`}
                        </div>
                        <div
                          className="text-sm font-semibold break-words"
                          style={{ color: t.colors.textPrimary }}
                        >
                          {a?.fullAddress || "-"}
                        </div>
                        <div
                          className="text-xs mt-2"
                          style={{ color: t.colors.textSecondary }}
                        >
                          {a?.city || "-"} • {a?.country || "-"} • {a?.postalCode || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: t.colors.textSecondary }}>No addresses.</div>
                )}
              </Section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t flex justify-end shrink-0"
          style={{ borderColor: t.colors.borderColor }}
        >
          <CancelButton onClose={onClose} saving={loading} title="Close" />
        </div>
      </div>
    </div>
  );
}

/* ----------------- Components ----------------- */

function OrderProductCard({ item, borderColor, radius, textPrimary, textSecondary, primary }) {
  const p = item?.product;

  const productName = p?.name || "Product not found";
  const productImg = toFullUrl(pickImage(p), API_BASE);

  const brandName = p?.brand?.name || "-";
  const brandImg = toFullUrl(pickImage(p?.brand), API_BASE);

  const categoryName = p?.category?.name || "-";
  const categoryImg = toFullUrl(pickImage(p?.category), API_BASE);

  return (
    <div
      className="border p-3 flex gap-3"
      style={{
        borderColor,
        borderRadius: radius,
        background: "white",
      }}
    >
      <ThumbNail src={productImg} alt={productName} borderColor={borderColor} radius={radius} />

      <div className="min-w-0 flex-1">
        <div className="font-semibold text-sm truncate" title={productName} style={{ color: textPrimary }}>
          {productName}
        </div>

        <div className="text-xs mt-1" style={{ color: textSecondary }}>
          Qty: {item?.quantity ?? "-"} • Unit: {item?.unitPrice ?? "-"} • Subtotal: {item?.subtotal ?? "-"}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <MiniEntity
            label="Brand"
            name={brandName}
            img={brandImg}
            borderColor={borderColor}
            radius={radius}
            primary={primary}
            textPrimary={textPrimary}
          />
          <MiniEntity
            label="Category"
            name={categoryName}
            img={categoryImg}
            borderColor={borderColor}
            radius={radius}
            primary={primary}
            textPrimary={textPrimary}
          />
        </div>
      </div>
    </div>
  );
}

function MiniEntity({ label, name, img, borderColor, radius, primary, textPrimary }) {
  return (
    <div
      className="border px-2 py-2 flex items-center gap-2"
      style={{
        borderColor,
        borderRadius: radius,
        background: "white",
      }}
    >
      <div className="text-[10px] font-semibold" style={{ color: primary }}>
        {label}
      </div>
      <div className="flex items-center gap-2">
        <div
          className="shirnk-0 w-14 h-14 border overflow-hidden flex items-center justify-center"
          style={{ borderColor, borderRadius: radius, background: "white" }}
        >
          {img ? (
            <img src={img} alt={name} className="w-12 h-12 object-contain" />
          ) : (
            <div className="text-[9px] font-semibold text-center px-1" style={{ color: "#999" }}>
              N/A
            </div>
          )}
        </div>
        <div className="text-xs font-semibold max-w-[180px] truncate" style={{ color: textPrimary }}>
          {name}
        </div>
      </div>
    </div>
  );
}

function ThumbNail({ src, alt, borderColor, radius }) {
  return (
    <div
      className="shrink-0 w-16 h-16 border overflow-hidden flex items-center justify-center"
      style={{
        borderColor,
        borderRadius: radius,
        background: "white",
      }}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-contain" />
      ) : (
        <div className="text-[10px] font-semibold text-center px-1" style={{ color: "#999" }}>
          No Image
        </div>
      )}
    </div>
  );
}


function Info({ label, value }) {
  const t = useTheme();
  return (
    <div
      className="border px-3 py-3"
      style={{
        borderColor: t.colors.borderColor,
        borderRadius: t.radius.md,
        background: "white",
      }}
    >
      <div className="text-xs font-semibold" style={{ color: t.colors.primary }}>
        {label}
      </div>
      <div className="text-sm font-bold mt-2 break-words" style={{ color: t.colors.textPrimary }}>
        {value || "-"}
      </div>
    </div>
  );
}

function Badge({ text }) {
  const t = useTheme();
  return (
    <span
      className="mt-2 border px-2 py-1 font-semibold "
      style={{
        borderRadius: t.radius.md,
        background: "#FFF7ED",
        borderColor: "#FED7AA",
        color: "#EA580C",        
      }}
    >
      {text}
    </span>
  );
}

/* ----------------- Helpers ----------------- */

function pickImage(entity) {
  if (!entity) return ""; // if no entity, return empty string
  const fromImages = // if entity has images, return first image, else return empty string
    Array.isArray(entity?.images) && entity.images.length > 0
      ? entity.images[0]?.url || entity.images[0]
      : "";
  const fromImageObj = entity?.image?.url || "";
  const fromImageStr = typeof entity?.image === "string" ? entity.image : "";
  return fromImages || fromImageObj || fromImageStr || "";
}

function toFullUrl(src, base) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (!base) return src;
  if (src.startsWith("/")) return `${base}${src}`;
  return `${base}/${src}`;
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}
