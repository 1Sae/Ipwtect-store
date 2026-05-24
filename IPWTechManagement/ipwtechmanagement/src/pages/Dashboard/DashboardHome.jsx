import React, { Children, useState } from 'react'
import { useTheme } from '../../contexts/ThemeContexts'
import { AdminContext } from '../../providers/AdminProvider'
import { useEffect } from 'react'
import { useContext } from 'react'
import { adminService } from '../../services/Services'
import { useAlert } from '../../providers/AlertProvider'
import {IMAGE_BASE_URL } from "../../config/apiPaths";
import {
  LuUser,
  LuTrendingUp,
  LuPackage,
  LuDollarSign,
  LuShoppingCart,
  LuChartBarStacked,
  LuChartBar,
  LuPackageCheck,
  LuTimerReset,
  LuTruck,
  LuListX,
  LuWarehouse,
  LuHourglass,
} from "react-icons/lu";
import { useNavigate } from 'react-router-dom'
import AnalyticsChartCard from '../../components/modals/AnalyticsChartCard'

function TableCard({ title, subtitle, icon: Icon, children }) {
  const t = useTheme()
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md"
    style={{
      background: t.colors.surface,
    }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"
        style={{background: "#FFF3E8"}}
        >
          <Icon size={20} className="text-orange-600"/>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className='ml-auto text-right px-2 py-1 rounded-lg flex flex-col items-end'
          style={{
            background: "#FFF3E8"
          }}
        >
          <p className="text-xs" style={{ fontSize: "10px", color: t.colors.primary }}>
            {Children.count(children)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}


function TopProductRow({ index, product }) {
  const t = useTheme();

  return (
    <div
      className="
        flex items-center justify-between
        rounded-2xl px-4 py-3
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md
        cursor-pointer
      "
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        border: `1px solid ${t.colors.borderColor}`,
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Rank */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs"
          style={{
            background: `radial-gradient(circle at top left, #ffffff 0%, ${t.colors.primary}22 70%)`,
            color: t.colors.primary,
            border: `1px solid ${t.colors.primary}33`,
          }}
        >
          {index + 1}
        </div>

        {/* Product name */}
        <p
          className="font-semibold truncate"
          style={{
            fontSize: "13px",
            color: t.colors.textPrimary,
            maxWidth: 160,
          }}
        >
          {product.name}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end leading-tight">
        <span
          className="text-xs"
          style={{ color: t.colors.textSecondary }}
        >
          {product.sold} sales
        </span>

        <span
          className="text-sm font-bold"
          style={{ color: "#22C55E" }}
        >
          ${product.totalSales}
        </span>
      </div>
    </div>

  );
}

function NewUserRow({ user }) {
  const t = useTheme();

  return (
    <div
        className="
        flex items-center justify-between
        rounded-2xl px-4 py-3
        transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-md
        cursor-pointer
      "
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
        border: `1px solid ${t.colors.borderColor}`,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs"
          style={{
            background: `radial-gradient(circle at top left, #ffffff 0%, ${t.colors.primary}22 70%)`,
            color: t.colors.primary,
            border: `1px solid ${t.colors.primary}33`,
          }}
        >
          {user.name.slice(0, 2).toUpperCase()}
        </div>

        <div className="leading-tight">
          <p
            className="font-semibold"
            style={{ fontSize: "12px", color: t.colors.textPrimary }}
          >
            {user.name}
          </p>
          <p
            className="text-xs truncate max-w-[160px]"
            style={{ color: t.colors.textSecondary }}
          >
            {user.email}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 text-xs">
        <LuShoppingCart size={13} style={{ color: t.colors.primary }} />

        <span style={{ color: t.colors.textSecondary }}>
          :
        </span>

        <span className="font-bold" style={{ color: t.colors.primary }}>
          {user.orders}
        </span>
      </div>
    </div>
  );
}


function StatCard({ label, value, icon: Icon, cfg }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center justify-between transition-all duration-300 hover:-translate-y-1
      hover:shadow-lg scale-100 hover:scale-105 ease-in-out cursor-pointer"
      style={{
        background: `linear-gradient(
          135deg,
          ${cfg.bgColor} 0%,
          rgba(255,255,255,0.65) 60%,
          #ffffff 100%
        )`,
        border: `1px solid ${cfg.borderColor}`,
        boxShadow: cfg.shadow,
      }}
    >
      <div>
        <p className="text-sm font-semibold uppercase text-gray-500">
          {label}
        </p>
        <p
          className="text-3xl font-bold mt-1"
          style={{ color: cfg.borderColor }}
        >
          {Icon === LuDollarSign ? `$${value}` : value}
        </p>
      </div>

      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: cfg.bgColor }}
      >
        <Icon size={22} className={cfg.textClass} />
      </div>
    </div>
  );
}

function MiniStatStrip({ items }) {
  const t = useTheme();
  return (
    <div
      className="
        mt-6
        w-full
        rounded-2xl
        px-4 py-4
        flex flex-wrap md:flex-nowrap
        items-center justify-between
        gap-4
        shadow-md
      "
      style={{ background: t.colors.surface }}
    >
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 px-2 py-2 min-w-[160px] cursor-pointer transition-all duration-600 hover:-translate-y-1 hover:shadow-lg scale-95 hover:scale-100 ease-in-out rounded-xl">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: item.cfg.bgColor }}
          >
            <item.icon size={20} className={item.cfg.textClass} />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span
              className="text-lg font-bold"
              style={{ color: item.cfg.borderColor }}
            >
              {item.value}
            </span>
            <span className="text-sm text-gray-500">
              {item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function NewestItemsTable({
  products = [],
  categories = [],
  brands = [],
  getImageUrl,
}) {
  const navigate = useNavigate();
  const t = useTheme();
  const [activeTab, setActiveTab] = useState("products");

  const TAB_CONFIG = {
    products: { label: "Products", data: products, showPrice: true },
    categories: { label: "Categories", data: categories, showPrice: false },
    brands: { label: "Brands", data: brands, showPrice: false },
  };

  const { data, showPrice } = TAB_CONFIG[activeTab];

  return (
    <div
      className="rounded-3xl p-6 shadow-xl"
      style={{
        background: `linear-gradient(180deg, ${t.colors.surface}, #fff)`,
        border: `1px solid ${t.colors.borderColor}`,
      }}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold" style={{ color: t.colors.textPrimary }}>
            Newest Items
          </h3>
          <p className="text-sm" style={{ color: t.colors.textSecondary }}>
            Live system activity
          </p>
        </div>

        {/* ===== PREMIUM TABS ===== */}
        <div
          className="flex p-1 gap-2 rounded-full backdrop-blur-md shadow-md cursor-pointer" 
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            border: `1px solid ${t.colors.borderColor}`,
          }}
        >
          {Object.keys(TAB_CONFIG).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`
                relative px-5 py-2 text-sm font-semibold rounded-full
                transition-all duration-300 shadow-xl cursor-pointer
                ${
                  activeTab === key
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-orange-600 hover:bg-orange-100"
                }
              `}
            >
              {TAB_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== LIST ===== */}
      <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {data.slice(0, 5).map((item) => (
          <div
            key={item._id}
            className="
              group relative flex items-center justify-between
              rounded-2xl p-4
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-lg
              cursor-pointer
            "
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: `1px solid ${t.colors.borderColor}`,
            }}
          >
            {/* LEFT */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative">
                <img
                  src={getImageUrl(item.image || item.logo)}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-contain bg-white"
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className="font-semibold truncate"
                  style={{ color: t.colors.textPrimary }}
                >
                  {item.name}
                </span>
                <span className="text-xs" style={{ color: t.colors.textSecondary }}>
                  ID · {item._id.slice(0, 6)} ·{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {showPrice && item.price && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                  ${item.price.toLocaleString()}
                </span>
              )}

              <span className="text-orange-500 font-bold" style={{color: t.colors.primary}} onClick={() => navigate(`/${activeTab}`)}>
                →
              </span>
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="py-10 text-center text-sm font-semibold text-gray-400">
            No recent items
          </div>
        )}
      </div>
    </div>
  );
}

function NewestOrdersFeed({ orders = [], getImageUrl }) {
  const t = useTheme();

  return (
    <div
      className="rounded-3xl shadow-xl flex flex-col h-[580px]"
      style={{
        background: t.colors.surface,
        border: `1px solid ${t.colors.borderColor}`,
      }}
    >
      {/* ===== STICKY HEADER ===== */}
      <div
        className="sticky top-0 z-10 px-6 py-5 border-b backdrop-blur-md"
        style={{
          background: `${t.colors.surface}ee`, // solid + blur
          borderColor: t.colors.borderColor,
        }}
      >
        <h3
          className="text-lg font-bold"
          style={{ color: t.colors.textPrimary }}
        >
          Newest Orders
        </h3>
        <p
          className="text-sm"
          style={{ color: t.colors.textSecondary }}
        >
          Latest purchases with items
        </p>
      </div>

      {/* ===== SCROLLABLE ORDERS ===== */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 pr-2 cursor-pointer">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-2xl p-4 transition hover:shadow-md hover:-translate-y-1 duration-300" 
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
              border: `1px solid ${t.colors.borderColor}`,
            }}
          >
            {/* ORDER HEADER */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p
                  className="font-semibold"
                  style={{ color: t.colors.textPrimary }}
                >
                  {order.user.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: t.colors.textSecondary }}
                >
                  {order.user.email}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: t.colors.textSecondary }}
                >
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-600">
                ${order.totalAmount.toLocaleString()}
              </span>
            </div>

            {/* ITEMS */}
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl p-2"
                  style={{ background: "#F9FAFB" }}
                >
                  <img
                    src={getImageUrl(item.product?.image)}
                    alt={item.product?.name}
                    className="w-10 h-10 rounded-lg object-contain bg-white"
                  />

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: t.colors.textPrimary }}
                    >
                      {item.product?.name}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-orange-500">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-10 text-center text-sm font-semibold text-gray-400">
            No recent orders
          </div>
        )}
      </div>
    </div>
  );
}


const DashboardHome = () => {
  const t = useTheme();
  const {showAlert} = useAlert();
  const { admin } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);

  const initialDashboardState = {
    lists: {
      topSelling: [],
      lowStock: [],
      outOfStock: [],
      newestProducts: [],
      newestCategories: [],
      newestBrands: [],
      newestOrders: [],
      newUsers: [],
    },
    totals: {
      users: 0,
      orders: 0,
      products: 0,
      categories: 0,
      brands: 0,
      sales: 0,
      stock: 0,
      lowStock: 0,
      outOfStock: 0,
      delivered: 0,
      cancelled: 0,
      pending: 0,
      shipped: 0,
      processing: 0,
    },
    salesChart: {
      today: [],
      last7Days: [],
      last30Days: [],
    },
    ordersChart: {
      today: [],
      last7Days: [],
      last30Days: [],
    },
    
  };
  
  const [dashboard, setDashboard] = useState(initialDashboardState);

  const CARD_CFG = {
    sales: {
      bgColor: "#DCFCE7",          // soft green
      borderColor: "#22c55e",      // emerald green
      textClass: "text-green-600",
      shadow: "0 12px 28px -12px rgba(34,197,94,0.45)",
    },    
    orders: {
      bgColor: "#E0F2FE",
      borderColor: "#0284c7",
      textClass: "text-sky-600",
      shadow: "0 12px 28px -12px rgba(2, 132, 199, 0.45)",
    },
    products: {
      bgColor: "#FFF3E8",          // soft warm orange background
      borderColor: "#F97316",      // strong but clean orange
      textClass: "text-orange-600",
      shadow: "0 12px 28px -12px rgba(249,115,22,0.45)",
    },    
    categories: {
      bgColor: "#CCFBF1",
      borderColor: "#14B8A6",
      textClass: "text-teal-600",
      shadow: "0 12px 28px -12px rgba(20,184,166,0.45)",
    },        
    brands: {
      bgColor: "#FEE2E2",          // soft red / rose background
      borderColor: "#EF4444",      // strong red border
      textClass: "text-red-600",
      shadow: "0 12px 28px -12px rgba(239,68,68,0.45)",
    },
    pending: {
      bgColor: "#FEF3C7",
      borderColor: "#F59E0B",
      textClass: "text-amber-600",
      shadow: "0 12px 28px -12px rgba(245,158,11,0.45)",
    },
    processing: {
      bgColor: "#DBEAFE",
      borderColor: "#3B82F6",
      textClass: "text-blue-600",
      shadow: "0 12px 28px -12px rgba(59,130,246,0.45)",
    },
    shipped: {
      bgColor: "#EDE9FE",
      borderColor: "#8B5CF6",
      textClass: "text-violet-600",
      shadow: "0 12px 28px -12px rgba(139,92,246,0.45)",
    },
    delivered: {
      bgColor: "#E0F2FE",
      borderColor: "#0284C7",
      textClass: "text-sky-600",
      shadow: "0 12px 28px -12px rgba(2,132,199,0.45)",
    },
    cancelled: {
      bgColor: "#FEE2E2",
      borderColor: "#EF4444",
      textClass: "text-red-600",
      shadow: "0 12px 28px -12px rgba(239,68,68,0.45)",
    },
    lowStock: {
      bgColor: "#FFEDD5",
      borderColor: "#F97316",
      textClass: "text-orange-600",
      shadow: "0 12px 28px -12px rgba(249,115,22,0.45)",
    },
    outOfStock: {
      bgColor: "#FFE4E6",
      borderColor: "#E11D48",
      textClass: "text-rose-600",
      shadow: "0 12px 28px -12px rgba(225,29,72,0.45)",
    },    
  };
  
  const getImageUrl = (imgPath) => {
      if (!imgPath) return "";
      if (imgPath.startsWith("http")) return imgPath;
    
      return `${IMAGE_BASE_URL}/${String(imgPath).replace(/^\/+/, "")}`;
  };
  
  const getMainImage = (p) => {
      if (p?.image) return p.image;                 // main image field
      if (Array.isArray(p?.images) && p.images[0]) return p.images[0]; // fallback
      return ""; // will trigger placeholder onError
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
  
        const response = await adminService.getDashboardData();
        const payload = response?.data?.data;
  
        if (!payload) {
          throw new Error("Invalid dashboard payload");
        }
  
        setDashboard({
          lists: {
            topSelling: payload.topSellingProducts ?? [],
            lowStock: payload.lowStockProducts ?? [],
            outOfStock: payload.outOfStockProducts ?? [],
            newestProducts: payload.newestProducts ?? [],
            newestCategories: payload.newestCategories ?? [],
            newestBrands: payload.newestBrands ?? [],
            newestOrders: payload.newestOrders ?? [],
            newUsers: payload.newUsers ?? [],
          },
          totals: {
            users: payload.totalUsers ?? 0,
            orders: payload.totalOrders ?? 0,
            products: payload.totalProducts ?? 0,
            categories: payload.totalCategories ?? 0,
            brands: payload.totalBrands ?? 0,
            sales: payload.totalSales ?? 0,
            stock: payload.totalStock ?? 0,
            lowStock: payload.totalLowStock ?? 0,
            outOfStock: payload.totalOutOfStock ?? 0,
            delivered: payload.totalDelivered ?? 0,
            cancelled: payload.totalCancelled ?? 0,
            pending: payload.totalPending ?? 0,
            shipped: payload.totalShipped ?? 0,
            processing: payload.totalProcessing ?? 0,
          },
          salesChart: payload.salesChart ?? {
            today: [],
            last7Days: [],
            last30Days: [],
          },
          ordersChart: payload.ordersChart ?? {
            today: [],
            last7Days: [],
            last30Days: [],
          },
          
        });
  
        showAlert("success", "Dashboard data loaded successfully");
      } catch (err) {
        showAlert("error", "Failed to load dashboard data");
        setDashboard(initialDashboardState);
      } finally {
        setLoading(false);
      }
    };
  
    loadDashboardData();
  }, []);
  
  

  return (
    <div className='h-screen flex flex-col'>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between rounded-lg gap-2 px-2 py-2 w-full shrink-0 ">
        <div className="mb-1">
          <h1 className="font-bold" style={{ color: t.colors.primary, fontSize: t.typography.h3 }}>
            Dashboard
          </h1>
          <p style={{ color: t.colors.secondColor, fontSize: t.typography.small }}>
            Welcome to your dashboard, where you can see all analytics and data summaries
          </p>             
        </div>

        {/* Profile */}
        <div
          className="
            flex items-center gap-2
            cursor-pointer
            px-2 py-2
            rounded-2xl
            border-1
            transition-all duration-300
            hover:-translate-y-0.5
          "
          style={{
            borderColor: t.colors.primary,
            background: `linear-gradient(
              135deg,
              ${t.colors.surface} 0%,
              #ffffff 70%
            )`,
            border: `1px solid ${t.colors.borderColor}`,
            boxShadow: "0 10px 25px -12px rgba(0,0,0,0.15)",
          }}
        >
          {/* Avatar */}
          <div
            className="relative w-11 h-11 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(
                circle at top left,
                #ffffff 0%,
                ${t.colors.primary}22 70%
              )`,
              border: `1px solid ${t.colors.primary}55`,
            }}
          >
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
              style={{ background: "#22c55e" }}
            />
            <LuUser size={22} style={{ color: t.colors.primary }} />
          </div>

          {/* Info */}
          <div className="flex flex-col leading-tight">
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: t.colors.textSecondary }}
            >
              Admin
            </span>

            <span
              className="text-sm font-semibold"
              style={{ color: t.colors.textPrimary }}
            >
              {admin?.name}
            </span>
          </div>
        </div>


      </div>
      
      <div className='flex-1 overflow-y-auto scroll-smooth'>
        {/* ================= STATS ================= */}
      <div className="mt-6 px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Sales"
          value={dashboard.totals.sales}
          icon={LuDollarSign}
          cfg={CARD_CFG.sales}
        />
        <StatCard
          label="Orders"
          value={dashboard.totals.orders}
          icon={LuShoppingCart}
          cfg={CARD_CFG.orders}
        />
        <StatCard
          label="Products"
          value={dashboard.totals.products}
          icon={LuPackage}
          cfg={CARD_CFG.products}
        />
        <StatCard
          label="Categories"
          value={dashboard.totals.categories}
          icon={LuChartBarStacked}
          cfg={CARD_CFG.categories}
        />
        <StatCard
          label="Brands"
          value={dashboard.totals.brands}
          icon={LuChartBar}
          cfg={CARD_CFG.brands}
        />
        
      </div>
      {/* ================= MINI KPI STRIP ================= */}
      <MiniStatStrip
        items={[
          {
            icon: LuTimerReset,
            value: dashboard.totals.pending,
            label: "Pending Orders",
            cfg: CARD_CFG.pending,
          },
          {
            icon: LuPackage,
            value: dashboard.totals.processing,
            label: "Processing Orders",
            cfg: CARD_CFG.processing,
          },
          {
            icon: LuTruck,
            value: dashboard.totals.shipped,
            label: "Shipped Orders",
            cfg: CARD_CFG.shipped,
          },
          {
            icon: LuPackageCheck,
            value: dashboard.totals.delivered,
            label: "Delivered Orders",
            cfg: CARD_CFG.delivered,
          },
          {
            icon: LuListX,
            value: dashboard.totals.cancelled,
            label: "Cancelled Orders",
            cfg: CARD_CFG.sales,
          },
          {
            icon: LuHourglass,
            value: dashboard.totals.lowStock,
            label: "Low Stock Products",
            cfg: CARD_CFG.lowStock,
          },
          {
            icon: LuWarehouse,
            value: dashboard.totals.outOfStock,
            label: "Out of Stock Products",
            cfg: CARD_CFG.outOfStock,
          },
        ]}
      />

      <div className="mt-8 px-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <AnalyticsChartCard
          dataSource={dashboard.ordersChart}
          title="Orders Analytics"
          subtitle="Order volume over time"
          icon={LuShoppingCart}
          emptyText="No orders data"
          tooltipLabel="Orders"
          color="#22c55e"
        />

        <AnalyticsChartCard
          dataSource={dashboard.salesChart}
          title="Sales Analytics"
          subtitle="Revenue performance"
          icon={LuTrendingUp}
          emptyText="No sales data"
          tooltipLabel="Sales ($)"
          color="#fb923c"
        />

      </div>



      <div className="mt-8 px-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <TableCard title="Top Selling Products" subtitle="Best performers" icon={LuTrendingUp}>
        {dashboard.lists.topSelling.slice(0, 5).map((p, i) => (
          <TopProductRow key={p._id} index={i} product={p} />
        ))}
      </TableCard>

      <TableCard title="New Users" subtitle="Recently joined" icon={LuUser}>
        {dashboard.lists.newUsers.slice(0, 5).map(u => (
          <NewUserRow key={u._id} user={u} />
        ))}
      </TableCard>

      <TableCard title="Low Stock" subtitle="Needs attention" icon={LuListX}>
        {dashboard.lists.lowStock.slice(0, 5).map(p => (
          <div
          className="
            flex items-center justify-between
            rounded-2xl px-4 py-3
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-md
            scale-100 hover:scale-105 ease-in-out
            cursor-pointer
          "
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            border: `1px solid ${t.colors.borderColor}`,
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs"
              style={{
                background: `radial-gradient(circle at top left, #ffffff 0%, ${t.colors.primary}22 70%)`,
                color: t.colors.primary,
                border: `1px solid ${t.colors.primary}33`,
              }}
            >
              {p.name.slice(0, 2).toUpperCase()}
            </div>

            {/* Product Name */}
            <div className="flex flex-col">
              <p
                className="font-semibold truncate max-w-[140px]"
                style={{
                  fontSize: "12px",
                  color: t.colors.textPrimary,
                }}
              >
                {p.name}
              </p>

              <span
                className="text-xs"
                style={{ color: t.colors.textSecondary }}
              >
                Product
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            <span
              className="text-xs font-medium"
              style={{ color: t.colors.textSecondary }}
            >
              Stock:
            </span>

            <span
              className="text-sm font-bold"
              style={{
                color: t.colors.primary
              }}
            >
              {p.stock}
            </span>
          </div>

        </div>

        ))}
      </TableCard>

      <TableCard title="Out of Stock" subtitle="Unavailable items" icon={LuWarehouse}>
        {dashboard.lists.outOfStock.slice(0, 5).map(p => (
          <div
          className="
            flex items-center justify-between
            rounded-2xl px-4 py-3
            transition-all duration-300
            hover:-translate-y-0.5 hover:shadow-md
            scale-100 hover:scale-105 ease-in-out
            cursor-pointer
          "
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
            border: `1px solid ${t.colors.borderColor}`,
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs"
              style={{
                background: `radial-gradient(circle at top left, #ffffff 0%, ${t.colors.primary}22 70%)`,
                color: t.colors.primary,
                border: `1px solid ${t.colors.primary}33`,
              }}
            >
              {p.name.slice(0, 2).toUpperCase()}
            </div>

            {/* Product Name */}
            <div className="flex flex-col">
              <p
                className="font-semibold truncate max-w-[140px]"
                style={{
                  fontSize: "12px",
                  color: t.colors.textPrimary,
                }}
              >
                {p.name}
              </p>

              <span
                className="text-xs"
                style={{ color: t.colors.textSecondary }}
              >
                Product
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            <span
              className="text-xs font-medium"
              style={{ color: t.colors.textSecondary }}
            >
              Stock:
            </span>

            <span
              className="text-sm font-bold"
              style={{
                color: t.colors.primary
              }}
            >
              {p.stock}
            </span>
          </div>

        </div>

        ))}
      </TableCard>
      </div>

      <div className="mt-8 mb-20 px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <NewestItemsTable
          products={dashboard.lists.newestProducts}
          categories={dashboard.lists.newestCategories}
          brands={dashboard.lists.newestBrands}
          getImageUrl={getImageUrl}
        />
        <NewestOrdersFeed
          orders={dashboard.lists.newestOrders}
          getImageUrl={getImageUrl}
        />


      </div>

      </div>

  </div>

  )
}

export default DashboardHome

