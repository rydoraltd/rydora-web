"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { naira } from "@/lib/format";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface VehicleRow {
  _id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  status: string;
  weeklyRemittanceTargetKobo: number;
  fundingTargetKobo: number;
  fundedKobo: number;
  assignedDriver?: { _id: string; firstName: string; lastName: string };
  investor?: { firstName: string; lastName: string };
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const EMPTY_FORM = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  plateNumber: "",
  color: "",
  weeklyRemittanceTargetKobo: "",
  fundingTargetKobo: "",
  driverPct: "30",
  investorPct: "55",
  rydoraPct: "15",
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["listed"],
  listed: ["draft", "funded"],
  funded: ["listed", "assigned"],
  assigned: ["active", "funded"],
  active: ["maintenance", "funded"],
  maintenance: ["active"],
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Mark as listed",
  listed: "Back to draft",
  funded: "Mark as listed",
  active: "Send to maintenance",
  maintenance: "Mark active",
};

export default function FleetPage() {
  const [rows, setRows] = useState<VehicleRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Assign-driver modal
  const [assignTarget, setAssignTarget] = useState<VehicleRow | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [assignBusy, setAssignBusy] = useState(false);
  const [assignErr, setAssignErr] = useState<string | null>(null);
  const [driversLoading, setDriversLoading] = useState(false);

  // Status change
  const [statusBusy, setStatusBusy] = useState<string | null>(null);

  function load() {
    api<{ items: VehicleRow[] }>("/vehicles")
      .then((d) => setRows(d.items))
      .catch((e) => setError(e.message));
  }

  useEffect(load, []);

  function field(key: keyof typeof EMPTY_FORM) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const driver = Number(form.driverPct);
    const investor = Number(form.investorPct);
    const rydora = Number(form.rydoraPct);
    if (driver + investor + rydora !== 100) {
      setFormError("Split percentages must total 100.");
      return;
    }
    setSaving(true);
    try {
      await api("/vehicles", {
        method: "POST",
        body: {
          make: form.make.trim(),
          model: form.model.trim(),
          year: Number(form.year),
          plateNumber: form.plateNumber.trim().toUpperCase(),
          color: form.color.trim() || undefined,
          weeklyRemittanceTargetKobo: Number(form.weeklyRemittanceTargetKobo) * 100,
          fundingTargetKobo: Number(form.fundingTargetKobo) * 100,
          split: { driverPct: driver, investorPct: investor, rydoraPct: rydora },
        },
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to add vehicle");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(vehicleId: string, newStatus: string) {
    setStatusBusy(vehicleId + newStatus);
    try {
      await api(`/vehicles/${vehicleId}`, { method: "PATCH", body: { status: newStatus } });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setStatusBusy(null);
    }
  }

  async function openAssign(vehicle: VehicleRow) {
    setAssignTarget(vehicle);
    setSelectedDriver("");
    setAssignErr(null);
    setDriversLoading(true);
    try {
      const data = await api<Driver[]>("/vehicles/available-drivers");
      setDrivers(data);
    } catch {
      setDrivers([]);
    } finally {
      setDriversLoading(false);
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!assignTarget || !selectedDriver) return;
    setAssignBusy(true);
    setAssignErr(null);
    try {
      await api(`/vehicles/${assignTarget._id}/assign-driver`, {
        method: "POST",
        body: { driverId: selectedDriver },
      });
      setAssignTarget(null);
      load();
    } catch (err) {
      setAssignErr(err instanceof Error ? err.message : "Assignment failed");
    } finally {
      setAssignBusy(false);
    }
  }

  async function handleUnassign(vehicleId: string) {
    setStatusBusy(vehicleId + "unassign");
    try {
      await api(`/vehicles/${vehicleId}/unassign-driver`, { method: "POST" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unassign failed");
    } finally {
      setStatusBusy(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Vehicles"
        description="The single registry every vehicle lives in."
        action={
          <button
            onClick={() => { setShowForm((v) => !v); setFormError(null); }}
            className="px-4 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)]"
          >
            {showForm ? "Cancel" : "+ Add vehicle"}
          </button>
        }
      />

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 border border-[var(--rd-line)] bg-[var(--rd-panel)] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl shadow-[var(--rd-shadow-sm)]"
        >
          <h2 className="col-span-full text-sm font-semibold text-[var(--rd-ink)] mb-1">New vehicle</h2>

          {[
            { label: "Make", key: "make", placeholder: "e.g. Toyota" },
            { label: "Model", key: "model", placeholder: "e.g. Corolla" },
            { label: "Year", key: "year", placeholder: "e.g. 2022", type: "number" },
            { label: "Plate number", key: "plateNumber", placeholder: "e.g. PH123ABC" },
            { label: "Color (optional)", key: "color", placeholder: "e.g. Silver" },
            { label: "Weekly remittance target (₦)", key: "weeklyRemittanceTargetKobo", placeholder: "e.g. 35000", type: "number" },
            { label: "Funding target (₦)", key: "fundingTargetKobo", placeholder: "e.g. 1500000", type: "number" },
          ].map(({ label, key, placeholder, type }) => (
            <label key={key} className="block">
              <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">{label}</span>
              <input
                type={type ?? "text"}
                value={form[key as keyof typeof EMPTY_FORM]}
                onChange={field(key as keyof typeof EMPTY_FORM)}
                placeholder={placeholder}
                required={key !== "color" && key !== "fundingTargetKobo"}
                className="mt-1 w-full border border-[var(--rd-line)] px-3 py-2 text-sm bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)]"
              />
            </label>
          ))}

          <div className="col-span-full">
            <span className="text-[11px] uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]">Revenue split (must total 100%)</span>
            <div className="mt-1 grid grid-cols-3 gap-3">
              {[
                { label: "Driver %", key: "driverPct" },
                { label: "Investor %", key: "investorPct" },
                { label: "Rydora %", key: "rydoraPct" },
              ].map(({ label, key }) => (
                <label key={key} className="block">
                  <span className="text-[11px] text-[var(--rd-ink-muted)]">{label}</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form[key as keyof typeof EMPTY_FORM]}
                    onChange={field(key as keyof typeof EMPTY_FORM)}
                    className="mt-1 w-full border border-[var(--rd-line)] px-3 py-2 text-sm bg-[var(--rd-panel)] text-[var(--rd-ink)] focus:outline-none focus:border-[var(--rd-primary)]"
                  />
                </label>
              ))}
            </div>
          </div>

          {formError && <p className="col-span-full text-sm text-[var(--rd-error)]">{formError}</p>}

          <div className="col-span-full">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add vehicle"}
            </button>
          </div>
        </form>
      )}

      {error ? <p className="text-sm text-[var(--rd-error)] mb-4">{error}</p> : null}

      {rows.length === 0 ? (
        <p className="text-sm text-[var(--rd-ink-muted)] border border-[var(--rd-line)] bg-[var(--rd-panel)] p-8 text-center rounded-xl">
          No vehicles registered yet. Use the button above to add your first vehicle.
        </p>
      ) : (
        <div className="border border-[var(--rd-line)] bg-[var(--rd-panel)] overflow-x-auto rounded-xl shadow-[var(--rd-shadow-sm)]">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--rd-line)]">
                {["Vehicle", "Plate", "Status", "Driver", "Investor", "Weekly target", "Funding", "Actions", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--rd-ink-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((v) => {
                const fundPct =
                  v.fundingTargetKobo > 0
                    ? Math.min(Math.round((v.fundedKobo / v.fundingTargetKobo) * 100), 100)
                    : null;
                const transitions = VALID_TRANSITIONS[v.status] ?? [];
                const canAssign = ["funded", "listed"].includes(v.status) && !v.assignedDriver;
                const canUnassign = !!v.assignedDriver && ["active", "assigned"].includes(v.status);

                return (
                  <tr key={v._id} className="border-b border-[var(--rd-line)] last:border-b-0 hover:bg-[var(--rd-surface)]">
                    <td className="px-4 py-3">
                      <span className="font-medium text-[var(--rd-ink)]">
                        {v.make} {v.model}{" "}
                        <span className="text-[var(--rd-ink-muted)]">{v.year}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs">{v.plateNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3 text-[var(--rd-ink-muted)]">
                      {v.assignedDriver
                        ? `${v.assignedDriver.firstName} ${v.assignedDriver.lastName}`
                        : <span className="text-[var(--rd-ink-muted)]">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 text-[var(--rd-ink-muted)]">
                      {v.investor
                        ? `${v.investor.firstName} ${v.investor.lastName}`
                        : <span className="text-[var(--rd-ink-muted)]">Open</span>}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {naira(v.weeklyRemittanceTargetKobo)}
                    </td>
                    <td className="px-4 py-3">
                      {fundPct !== null ? (
                        <div>
                          <div className="h-1.5 w-24 bg-[var(--rd-surface)] overflow-hidden rounded-full">
                            <div className="h-full bg-[var(--rd-primary)] rounded-full" style={{ width: `${fundPct}%` }} />
                          </div>
                          <span className="text-[10px] text-[var(--rd-ink-muted)]">{fundPct}%</span>
                        </div>
                      ) : (
                        <span className="text-[var(--rd-ink-muted)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {/* Quick status transitions */}
                        {transitions.slice(0, 1).map((next) => (
                          <button
                            key={next}
                            onClick={() => changeStatus(v._id, next)}
                            disabled={statusBusy === v._id + next}
                            className="px-2 py-1 text-[11px] font-medium border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] disabled:opacity-50 whitespace-nowrap"
                          >
                            {statusBusy === v._id + next ? "…" : STATUS_LABELS[v.status] ?? `→ ${next}`}
                          </button>
                        ))}

                        {/* Assign driver */}
                        {canAssign && (
                          <button
                            onClick={() => openAssign(v)}
                            className="px-2 py-1 text-[11px] font-medium border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:border-[var(--rd-primary)] hover:text-[var(--rd-primary)] whitespace-nowrap"
                          >
                            Assign driver
                          </button>
                        )}

                        {/* Unassign driver */}
                        {canUnassign && (
                          <button
                            onClick={() => handleUnassign(v._id)}
                            disabled={statusBusy === v._id + "unassign"}
                            className="px-2 py-1 text-[11px] font-medium border border-[var(--rd-line)] text-[var(--rd-ink-muted)] hover:border-[var(--rd-error)] hover:text-[var(--rd-error)] disabled:opacity-50 whitespace-nowrap"
                          >
                            {statusBusy === v._id + "unassign" ? "…" : "Unassign"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/fleet/${v._id}`}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--rd-line)] text-[var(--rd-primary)] hover:bg-blue-50 transition-colors whitespace-nowrap"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign driver modal */}
      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--rd-panel)] border border-[var(--rd-line)] w-full max-w-md p-6 rounded-xl shadow-[var(--rd-shadow-md)]">
            <h2 className="text-sm font-semibold text-[var(--rd-ink)] mb-1">
              Assign driver to {assignTarget.make} {assignTarget.model} ({assignTarget.plateNumber})
            </h2>
            <p className="text-xs text-[var(--rd-ink-muted)] mb-4">
              Only active, unassigned drivers are listed below.
            </p>

            {driversLoading ? (
              <p className="text-sm text-[var(--rd-ink-muted)]">Loading drivers…</p>
            ) : (
              <form onSubmit={handleAssign}>
                {drivers.length === 0 ? (
                  <p className="text-sm text-[var(--rd-ink-muted)] mb-4">
                    No available drivers found. Approve a driver first from the Approvals page.
                  </p>
                ) : (
                  <div className="mb-4 max-h-48 overflow-y-auto border border-[var(--rd-line)] rounded-lg">
                    {drivers.map((d) => (
                      <label
                        key={d._id}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[var(--rd-line)] last:border-b-0 ${
                          selectedDriver === d._id ? "bg-[var(--rd-surface)]" : "hover:bg-[var(--rd-surface)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="driver"
                          value={d._id}
                          checked={selectedDriver === d._id}
                          onChange={() => setSelectedDriver(d._id)}
                          className="accent-[var(--rd-primary)]"
                        />
                        <div>
                          <p className="text-sm font-medium text-[var(--rd-ink)]">
                            {d.firstName} {d.lastName}
                          </p>
                          {d.phone && (
                            <p className="text-xs text-[var(--rd-ink-muted)]">{d.phone}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {assignErr && (
                  <p className="text-xs text-[var(--rd-error)] mb-3">{assignErr}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={assignBusy || !selectedDriver}
                    className="px-4 py-2 text-sm font-medium bg-[var(--rd-primary)] text-[var(--rd-ink-on-dark)] hover:bg-[var(--rd-primary-strong)] disabled:opacity-50"
                  >
                    {assignBusy ? "Assigning…" : "Assign driver"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssignTarget(null)}
                    className="px-4 py-2 text-sm text-[var(--rd-ink-muted)] hover:text-[var(--rd-ink)]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
