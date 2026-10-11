"use client";

import * as React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Clock, CheckCircle2, Calendar, MapPin, Filter, Search, Plus } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/state-views";
import { getFacilitiesAction, createFacilityAction, bookFacilityAction } from "@/actions/operations";

export default function CampusFacilitiesPage() {
  const { success, error } = useToast();
  const [facilities, setFacilities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [filterCat, setFilterCat] = React.useState("All");
  const [search, setSearch] = React.useState("");

  // Modals
  const [selectedFacility, setSelectedFacility] = React.useState<any | null>(null);
  const [bookingDate, setBookingDate] = React.useState("2026-10-15");
  const [bookingTime, setBookingTime] = React.useState("02:00 PM - 04:00 PM");
  const [purpose, setPurpose] = React.useState("");
  const [isBooking, setIsBooking] = React.useState(false);

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [newFacility, setNewFacility] = React.useState({
    name: "",
    category: "Specialized Lab",
    location: "",
    capacity: 60,
    operatingHours: "08:00 AM - 09:00 PM",
    status: "available" as any,
    description: "",
  });
  const [isCreating, setIsCreating] = React.useState(false);

  const categories = ["All", "Specialized Lab", "Auditorium", "Library Space", "Recreation"];

  const fetchFacilities = React.useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const res = await getFacilitiesAction();
      if (res.success && res.data) {
        setFacilities(res.data);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;
    setIsBooking(true);
    try {
      const res = await bookFacilityAction({
        facilityId: selectedFacility.id,
        bookingDate,
        timeSlot: bookingTime,
        purpose,
      });

      if (res.success) {
        success("Reservation Confirmed", `Permit granted for ${selectedFacility.name} on ${bookingDate}.`);
        setSelectedFacility(null);
        setPurpose("");
      } else {
        error("Booking Failed", res.message || "Please check inputs.");
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await createFacilityAction(newFacility);
      if (res.success) {
        success("Facility Registered", "New facility provisioned in campus inventory.");
        setCreateModalOpen(false);
        setNewFacility({
          name: "",
          category: "Specialized Lab",
          location: "",
          capacity: 60,
          operatingHours: "08:00 AM - 09:00 PM",
          status: "available",
          description: "",
        });
        fetchFacilities();
      } else {
        error("Registration Failed", res.message);
      }
    } catch (err: any) {
      error("Error", err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = facilities.filter((f) => {
    const matchCat = filterCat === "All" || f.category === filterCat;
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <DashboardShell
      title="Campus Facilities & Resource Booking"
      description="Reserve lecture halls, research workstations, sports courts, and collaborative study spaces"
      actions={
        <Button size="sm" onClick={() => setCreateModalOpen(true)} className="gap-1.5 shadow-sm shadow-blue-500/20">
          <Plus className="h-4 w-4" />
          <span>Provision Facility</span>
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filter controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-200/80 bg-white/70 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterCat === c
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search facilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
        </div>

        {/* State Views */}
        {loading ? (
          <LoadingState message="Fetching campus facilities from PostgreSQL..." />
        ) : hasError ? (
          <ErrorState onRetry={fetchFacilities} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No Facilities Found"
            description="No campus facilities match the selected filter."
            actionLabel="Provision Facility"
            onAction={() => setCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((f) => (
              <Card key={f.id} className="hover:border-blue-500/40 transition-all flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{f.category}</Badge>
                    {f.status === "available" ? (
                      <Badge variant="success">Available Now</Badge>
                    ) : f.status === "booked" ? (
                      <Badge variant="warning">In Session</Badge>
                    ) : (
                      <Badge variant="destructive">Maintenance</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-bold">{f.name}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1.5 text-zinc-500 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{f.location}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {f.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Capacity: {f.capacity} seats</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{f.operating_hours || f.hours || "08:00 AM - 08:00 PM"}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                    <Button
                      size="sm"
                      disabled={f.status === "maintenance"}
                      className="gap-1.5 text-xs shadow-sm shadow-blue-500/20"
                      onClick={() => setSelectedFacility(f)}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {f.status === "available" ? "Reserve Facility" : "Request Slot Waitlist"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {selectedFacility && (
        <Modal
          isOpen={!!selectedFacility}
          onClose={() => setSelectedFacility(null)}
          title={`Reserve Facility: ${selectedFacility.name}`}
          description={`${selectedFacility.location} • Max Capacity: ${selectedFacility.capacity} participants`}
        >
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Reservation Date"
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Time Slot
                </label>
                <select
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                >
                  <option>09:00 AM - 11:00 AM</option>
                  <option>11:30 AM - 01:30 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                  <option>04:30 PM - 06:30 PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Purpose / Activity Details
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe workshop agenda or experiment specifics..."
                className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedFacility(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isBooking}>
                {isBooking ? "Submitting..." : "Submit Booking Permit"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Provision Facility Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Provision Campus Facility"
        description="Creates facility record in PostgreSQL campus_facilities table"
      >
        <form onSubmit={handleCreateFacility} className="space-y-4">
          <Input
            label="Facility Name"
            required
            placeholder="e.g. VLSI Design Studio & Cleanroom"
            value={newFacility.name}
            onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <select
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                value={newFacility.category}
                onChange={(e) => setNewFacility({ ...newFacility, category: e.target.value })}
              >
                <option>Specialized Lab</option>
                <option>Auditorium</option>
                <option>Library Space</option>
                <option>Recreation</option>
              </select>
            </div>
            <Input
              label="Location / Block"
              required
              placeholder="e.g. Tech Block B • 2nd Floor"
              value={newFacility.location}
              onChange={(e) => setNewFacility({ ...newFacility, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Capacity (Seats)"
              type="number"
              required
              value={newFacility.capacity}
              onChange={(e) => setNewFacility({ ...newFacility, capacity: Number(e.target.value) })}
            />
            <Input
              label="Operating Hours"
              required
              value={newFacility.operatingHours}
              onChange={(e) => setNewFacility({ ...newFacility, operatingHours: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              rows={2}
              placeholder="Hardware specs, software licenses, acoustics..."
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900"
              value={newFacility.description}
              onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Provisioning..." : "Provision Facility"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardShell>
  );
}
