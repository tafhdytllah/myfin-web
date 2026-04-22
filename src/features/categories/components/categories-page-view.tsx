import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";

const categories = [
  { name: "Food", type: "EXPENSE", active: true, used: 12 },
  { name: "Salary", type: "INCOME", active: true, used: 4 },
  { name: "Old Reimbursements", type: "INCOME", active: false, used: 2 },
];

export function CategoriesPageView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize income and expense groups with active and inactive visibility."
        action={
          <button
            type="button"
            className="rounded-2xl bg-[var(--color-surface-sidebar)] px-5 py-3 text-sm font-semibold text-white"
          >
            Add Category
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-5">
        {[
          { label: "Total", value: "10" },
          { label: "Active", value: "8" },
          { label: "Inactive", value: "2" },
          { label: "Income", value: "4" },
          { label: "Expense", value: "6" },
        ].map((item) => (
          <SectionCard key={item.label} title={item.label}>
            <p className="text-2xl font-semibold text-[var(--color-foreground)]">
              {item.value}
            </p>
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title="Search & Filters"
        description="Category name, type, and status will all sync with URL state."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {["Search", "Type", "Status"].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-dashed border-[var(--color-border-strong)] px-4 py-5 text-sm text-[var(--color-foreground-muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Category Table" description="Management table scaffold for API wiring.">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3 text-left text-sm">
            <thead>
              <tr className="text-[var(--color-foreground-muted)]">
                <th className="px-4">Name</th>
                <th className="px-4">Type</th>
                <th className="px-4">Status</th>
                <th className="px-4">Used</th>
                <th className="px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((row) => (
                <tr
                  key={row.name}
                  className="bg-[var(--color-surface)] text-[var(--color-foreground)]"
                >
                  <td className="rounded-l-3xl px-4 py-4 font-medium">{row.name}</td>
                  <td className="px-4 py-4">
                    <StatusBadge tone={row.type === "INCOME" ? "income" : "expense"}>
                      {row.type}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge tone={row.active ? "active" : "inactive"}>
                      {row.active ? "Active" : "Inactive"}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4">{row.used}</td>
                  <td className="rounded-r-3xl px-4 py-4">•••</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
