import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FileEdit,
  ImagePlus,
  X,
  Loader2,
  Wifi,
  Wind,
  Waves,
  Car,
  UtensilsCrossed,
  Tv,
  WashingMachine,
  Building2,
  Dumbbell,
  Coffee,
  ShowerHead,
  BedDouble,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader.jsx";
import { Button } from "@/components/ui/Button.jsx";
import { Input } from "@/components/ui/Input.jsx";
import { useUpsertListing } from "@/features/owner/useOwner.js";
import { useToast } from "@/context/ToastContext.jsx";
import { supabase } from "@/lib/supabase.js";

const BUCKET = "listing-photos";
const MAX_FILES = 5;
const MAX_SIZE_MB = 5;

const AMENITIES = [
  { id: "Wi-Fi", label: "Wi-Fi", icon: Wifi },
  { id: "AC", label: "AC", icon: Wind },
  { id: "Kolam renang", label: "Kolam renang", icon: Waves },
  { id: "Parkir", label: "Parkir", icon: Car },
  { id: "Dapur", label: "Dapur", icon: UtensilsCrossed },
  { id: "TV", label: "TV", icon: Tv },
  { id: "Mesin cuci", label: "Mesin cuci", icon: WashingMachine },
  { id: "Lift", label: "Lift", icon: Building2 },
  { id: "Gym", label: "Gym", icon: Dumbbell },
  { id: "Sarapan", label: "Sarapan", icon: Coffee },
  { id: "Kamar mandi dalam", label: "Kamar mandi dalam", icon: ShowerHead },
  { id: "Kasur queen", label: "Kasur queen", icon: BedDouble },
];

/** Upload satu file ke Supabase Storage, return public URL */
async function uploadPhoto(file, userId) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export default function ListingFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const isNew = location.pathname.endsWith("/new");
  const isEdit = Boolean(id && !isNew);
  const { upsert, loading: saving } = useUpsertListing();

  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [amenities, setAmenities] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(isEdit);

  // photos: array of { url: string, uploading?: boolean, file?: File, isExisting?: boolean }
  const [photos, setPhotos] = useState([]);
  const [uploadingCount, setUploadingCount] = useState(0);

  useEffect(() => {
    if (!isEdit || !supabase) {
      setLoadingExisting(false);
      return;
    }
    supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setForm({
            title: data.title ?? "",
            location: data.location ?? "",
            price: data.price ?? "",
            description: data.description ?? "",
          });
          if (Array.isArray(data.amenities)) setAmenities(data.amenities);
          if (Array.isArray(data.photos)) {
            setPhotos(data.photos.map((url) => ({ url, isExisting: true })));
          }
        }
        if (error)
          toast({
            title: "Failed to load listing",
            description: error.message,
            variant: "destructive",
          });
        setLoadingExisting(false);
      });
  }, [id, isEdit, toast]);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;

    const remaining = MAX_FILES - photos.length;
    if (remaining <= 0) {
      toast({ title: `Maximum ${MAX_FILES} photos`, variant: "destructive" });
      return;
    }

    const toUpload = files.slice(0, remaining);
    const oversized = toUpload.filter(
      (f) => f.size > MAX_SIZE_MB * 1024 * 1024,
    );
    if (oversized.length) {
      toast({
        title: `Ukuran file Max. ${MAX_SIZE_MB}MB`,
        description: oversized.map((f) => f.name).join(", "),
        variant: "destructive",
      });
      return;
    }

    if (!supabase) {
      toast({ title: "Supabase not configured", variant: "destructive" });
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not logged in", variant: "destructive" });
      return;
    }

    // Add placeholders dengan stable key per file
    const entries = toUpload.map((f) => ({
      key: `${f.name}-${f.size}-${f.lastModified}`,
      url: URL.createObjectURL(f),
      uploading: true,
      file: f,
    }));
    setPhotos((prev) => [...prev, ...entries]);
    setUploadingCount((c) => c + toUpload.length);

    for (const entry of entries) {
      try {
        const publicUrl = await uploadPhoto(entry.file, user.id);
        setPhotos((prev) =>
          prev.map((p) =>
            p.key === entry.key ? { url: publicUrl, isExisting: true } : p,
          ),
        );
      } catch (err) {
        toast({
          title: `Upload failed ${entry.file.name}`,
          description: err.message,
          variant: "destructive",
        });
        setPhotos((prev) => prev.filter((p) => p.key !== entry.key));
      } finally {
        setUploadingCount((c) => c - 1);
      }
    }
  }

  function removePhoto(url) {
    setPhotos((prev) => prev.filter((p) => p.url !== url));
  }

  function toggleAmenity(id) {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.price || Number(form.price) < 1)
      e.price = "Price must be greater than 0.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (uploadingCount > 0) {
      toast({ title: "Wait for photos to finish uploading" });
      return;
    }
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      await upsert(
        {
          title: form.title.trim(),
          location: form.location.trim(),
          price: Number(form.price),
          description: form.description.trim() || null,
          amenities,
          photos: photos.filter((p) => !p.uploading).map((p) => p.url),
        },
        isEdit ? id : null,
      );
      toast({
        title: isEdit ? "Listing updated" : "Listing created",
        description: isEdit
          ? "Changes saved."
          : "Listing is pending admin review.",
        variant: "success",
      });
      navigate("/Owner/listings");
    } catch (err) {
      toast({
        title: "Failed to save",
        description: err.message,
        variant: "destructive",
      });
    }
  }

  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-stone-200" />
            <div className="h-64 rounded-2xl bg-stone-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-stone-950">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
        <PageHeader
          eyebrow="Owner · Listing"
          icon={FileEdit}
          title={isNew ? "Listing baru" : "Edit listing"}
          description={
            isNew
              ? "Isi detail unit — akan menunggu review admin sebelum tampil."
              : "Perbarui informasi listing."
          }
        />

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8 space-y-6"
        >
          {/* Photo upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-800">
                photos properti
                <span className="ml-1.5 text-xs font-normal text-stone-500">
                  ({photos.length}/{MAX_FILES}) · Max. {MAX_SIZE_MB}MB per photos
                </span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map((p) => (
                <div
                  key={p.url}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100"
                >
                  <img
                    src={p.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {p.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                  )}
                  {!p.uploading && (
                    <button
                      type="button"
                      onClick={() => removePhoto(p.url)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {photos.length < MAX_FILES && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingCount > 0}
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 text-stone-400 transition hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-700 disabled:opacity-50"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">Tambah</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={handleFileChange}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-stone-800"
              htmlFor="title"
            >
              Judul listing
            </label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Cozy studio in Sudirman"
              disabled={saving}
            />
            {errors.title && (
              <p className="text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-stone-800"
              htmlFor="location"
            >
              Lokasi / Kota
            </label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              placeholder="South Jakarta"
              disabled={saving}
            />
            {errors.location && (
              <p className="text-xs text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-stone-800"
              htmlFor="price"
            >
              Harga / night (Rp)
            </label>
            <Input
              id="price"
              type="number"
              min={1}
              value={form.price}
              onChange={(e) => setField("price", e.target.value)}
              placeholder="500000"
              disabled={saving}
            />
            {errors.price && (
              <p className="text-xs text-red-600">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-stone-800"
              htmlFor="description"
            >
              Deskripsi
            </label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Tell us about the unit, tower facilities, house rules…"
              disabled={saving}
              className="flex w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base text-stone-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-stone-800">
              Fasilitas
              <span className="ml-1.5 text-xs font-normal text-stone-500">
                Select available
              </span>
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AMENITIES.map(({ id, label, icon: Icon }) => {
                const active = amenities.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleAmenity(id)}
                    disabled={saving}
                    className={
                      active
                        ? "flex items-center gap-2 rounded-xl border-2 border-teal-600 bg-teal-50 px-3 py-2.5 text-sm font-medium text-teal-900 transition"
                        : "flex items-center gap-2 rounded-xl border-2 border-stone-200 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                    }
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${active ? "text-teal-700" : "text-stone-400"}`}
                      aria-hidden
                    />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 border-t border-stone-100 pt-4">
            <Button type="submit" disabled={saving || uploadingCount > 0}>
              {saving
                ? "Saving…"
                : isEdit
                  ? "Save Changes"
                  : "Create Listing"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/Owner/listings")}
              disabled={saving}
            >
              Batal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


