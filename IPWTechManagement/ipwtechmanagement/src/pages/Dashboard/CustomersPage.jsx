import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../contexts/ThemeContexts";
import { useAlert } from "../../providers/AlertProvider";
import { usersService } from "../../services/Services";
import CustomersDropDown from "../../components/buttons/CustomersDropDown";
import { LuUsers, LuEye, LuUser, LuArrowDownUp } from "react-icons/lu";
import SaveButtons from "../../constants/SaveButtons";
import CustomersModal from "../../components/modals/CustomersModal";

const CustomersPage = () => {
  const t = useTheme();
  const { showAlert } = useAlert();

  const [allUsers, setAllUsers] = useState([]);
  const [newestUsers, setNewestUsers] = useState([]);

  const [userType, setUserType] = useState("all"); 
  const [sortBy, setSortBy] = useState("newest");

  const [loading, setLoading] = useState(false);
  const [metaDays, setMetaDays] = useState(7);
  const [metaTotal, setMetaTotal] = useState(0);

  const [selectedViewId, setSelectedViewId] = useState(null);
  const openViewModal = Boolean(selectedViewId);

  const normalizeAllUsers = (res) => {
    const payload = res?.data?.data;
    if (Array.isArray(payload)) return payload;
    if (payload?.users) return payload.users;
    return [];
  };

  const normalizeNewestUsers = (res) => {
    const payload = res?.data?.data;
    // newest users response: { days, total, users: [] }
    const obj = payload && typeof payload === "object" ? payload : null;

    const users = Array.isArray(obj?.users)
      ? obj.users
      : Array.isArray(payload)
      ? payload
      : [];

    const days = Number(obj?.days ?? 7);
    const total = Number(obj?.total ?? users.length);

    return {
      users,
      days: Number.isNaN(days) ? 7 : days,
      total: Number.isNaN(total) ? users.length : total,
    };
  };

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      const [Ures, Nres] = await Promise.all([
        usersService.getAllUsers(),
        usersService.getAllNewUsers(), // default 7 days on backend
      ]);

      setAllUsers(normalizeAllUsers(Ures));

      const newest = normalizeNewestUsers(Nres);
      setNewestUsers(newest.users);
      setMetaDays(newest.days);
      setMetaTotal(newest.total);
      showAlert("success", "Customers loaded successfully");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to load users");
      setAllUsers([]);
      setNewestUsers([]);
      setMetaDays(7);
      setMetaTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usersToShow = useMemo(() => {
    const base = userType === "newest" ? newestUsers : allUsers;
    const list = Array.isArray(base) ? [...base] : [];

    const getTime = (u) => {
      const d = u?.createdAt ? new Date(u.createdAt).getTime() : 0;
      return Number.isNaN(d) ? 0 : d;
    };

    list.sort((a, b) =>
      sortBy === "newest" ? getTime(b) - getTime(a) : getTime(a) - getTime(b)
    );

    return list;
  }, [userType, newestUsers, allUsers, sortBy]);

  const userTypeOptions = useMemo(
    () => [
      { value: "all", label: "All Users" },
      { value: "newest", label: `Newest Users (${metaDays} days)` },
    ],
    [metaDays]
  );

  const sortOptions = useMemo(
    () => [
      { value: "newest", label: "Sort: Newest" },
      { value: "oldest", label: "Sort: Oldest" },
    ],
    []
  );

  const handleReset = () => {
    setUserType("all");
    setSortBy("newest");
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
  };

  const getPrimaryAddress = (u) => {
    const list = Array.isArray(u?.addresses) ? u.addresses : [];
    if (list.length === 0) return "-";
    const a = list[0];
    const parts = [a?.city, a?.country].filter(Boolean);
    return parts.length ? parts.join(", ") : a?.fullAddress || "-";
  };

  return (
    <div className="mt-0">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 px-2 py-2 w-full justify-between rounded-lg">
        <div className="mb-1">
          <h1
            className="font-bold"
            style={{ color: t.colors.primary, fontSize: t.typography.h3 }}
          >
            Customers Page
          </h1>
          <p style={{ color: t.colors.textSecondary, fontSize: t.typography.small }}>
            View your customers list (all users or newest users).
          </p>
          {userType === "newest" && !loading && (
            <p style={{ color: t.colors.textSecondary, fontSize: t.typography.small }}>
              Newest users in last {metaDays} day(s): {metaTotal}
            </p>
          )}
        </div>

        <div className="mb-1 flex flex-col sm:flex-row gap-3 sm:items-end">
        <button
                type="button"
                onClick={handleReset}
                className="
                    text-orange-400
                    cursor-pointer
                    px-5 py-2 mb-0 text-sm font-semibold
                    rounded-md
                    transition-all duration-600 ease-out
                    hover:-translate-y-1
                    hover:shadow-[0_8px_15px_-6px_rgba(255,162,96,0.8)]
                    hover:bg-orange-400 hover:text-white
                    hover:border-orange-400
                    focus:outline-none
                "
                >
                Reset
                </button>
          <div className="w-full sm:w-48">
            <CustomersDropDown
              label="Users Type"
              value={userType}
              icon={<LuUser size={14} />}
              onChange={setUserType}
              options={userTypeOptions}
            />
          </div>

          <div className="w-full sm:w-48">
            <CustomersDropDown
              label="Sort By"
              value={sortBy}
              icon={<LuArrowDownUp size={14} />}
              onChange={setSortBy}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className="px-2 mt-3" style={{ color: t.colors.textSecondary }}>
        {loading ? "Loading..." : `Loaded ${usersToShow.length} user(s)`}
      </div>

      {/* Table */}
      <div
        className="mt-6 border shadow-sm overflow-hidden"
        style={{
          background: t.colors.surface,
          borderColor: t.colors.borderColor,
          borderRadius: t.radius.lg,
        }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between border-b"
          style={{ borderColor: t.colors.borderColor }}
        >
          <div className="flex items-center gap-2">
            <LuUsers style={{ color: t.colors.primary }} />
            <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
              Customers List
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="max-h-[620px] md:max-h-[620px] lg:max-h-[740px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr
                  className="text-left"
                  style={{
                    background: t.colors.inputBackground,
                    color: t.colors.textSecondary,
                  }}
                >
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Address</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {usersToShow.map((u, idx) => (
                  <tr
                    key={u?._id || idx}
                    className="border-t"
                    style={{ borderColor: t.colors.borderColor }}
                  >
                    <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                      {idx + 1}
                    </td>

                    <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                      {u?.name || "-"}
                    </td>

                    <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                      {u?.email || "-"}
                    </td>

                    <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                      {u?.phone || "-"}
                    </td>

                    <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                      {getPrimaryAddress(u)}
                    </td>

                    <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                      {u?.role || "user"}
                    </td>

                    <td className="px-4 py-3" style={{ color: t.colors.textPrimary }}>
                      {formatDate(u?.createdAt)}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-2 py-1.5 border text-xs font-semibold transition cursor-pointer"
                        style={{
                          borderRadius: t.radius.md,
                          borderColor: t.colors.borderColor,
                          background: "white",
                          color: t.colors.primary,
                        }}
                        onClick={() => setSelectedViewId(u?._id)}
                        title="View user"
                      >
                        <LuEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && usersToShow.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center" colSpan={8}>
                      <div className="font-semibold" style={{ color: t.colors.textPrimary }}>
                        No users found
                      </div>
                      <div className="text-sm" style={{ color: t.colors.textSecondary }}>
                        Try switching the filter or reset.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CustomersModal
        open={openViewModal}
        userId={selectedViewId}
        onClose={() => setSelectedViewId(null)}
      />
    </div>
  );
};

export default CustomersPage;
