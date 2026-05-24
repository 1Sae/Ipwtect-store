"use client";

import AddressManager from "@/src/components/profile/AddressManager";
import ProfileForm from "@/src/components/profile/ProfileForm";

export default function AccountPage() {
    return (
        <div className="max-w-[1100px] mx-auto px-4 py-10 flex flex-col gap-8">

        <h1 className="text-2xl font-bold text-orange-500">
            My Account
        </h1>

        {/* PROFILE */}
        <ProfileForm />

        {/* ADDRESSES */}
        <AddressManager />

        {/* FUTURE SECTION */}
        {/* Stats / Orders / Wishlist count */}

        </div>
    );
}