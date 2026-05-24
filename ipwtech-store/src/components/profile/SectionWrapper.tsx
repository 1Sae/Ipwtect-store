export default function SectionWrapper({
    title,
    children,
    }: {
        title: string;
        children: React.ReactNode;
    }) {
        return (
        <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
    
            <h2 className="text-lg font-semibold text-orange-500">
            {title}
            </h2>
    
            {children}
    
        </div>
    );
}