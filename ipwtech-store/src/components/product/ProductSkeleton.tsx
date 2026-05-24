export default function ProductSkeleton() {
    return (
        <div className="px-10 py-6 animate-pulse">
    
            {/* TOP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
    
            {/* IMAGE */}
            <div className="w-full h-[400px] bg-[#1e293b] rounded-xl" />
    
            {/* INFO */}
            <div className="flex flex-col gap-4">
                <div className="h-6 w-2/3 bg-[#1e293b] rounded" />
                <div className="h-4 w-1/3 bg-[#1e293b] rounded" />
                <div className="h-6 w-1/4 bg-[#1e293b] rounded" />
                <div className="h-20 w-full bg-[#1e293b] rounded" />
    
                <div className="flex gap-3 mt-4">
                <div className="h-10 w-32 bg-[#1e293b] rounded-xl" />
                <div className="h-10 w-24 bg-[#1e293b] rounded-xl" />
                </div>
            </div>
    
            </div>
    
            {/* SPECS */}
            <div className="mt-12 flex flex-col gap-3">
            <div className="h-5 w-40 bg-[#1e293b] rounded" />
    
            {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="flex justify-between">
                <div className="h-4 w-1/3 bg-[#1e293b] rounded" />
                <div className="h-4 w-1/4 bg-[#1e293b] rounded" />
                </div>
            ))}
            </div>
    
        </div>
        );
    }