import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

// Customer information form schema
const customerInfoSchema = z.object({
  commercialNameAr: z.string().optional(),
  commercialNameEn: z.string().optional(),
  commercialRegistrationNo: z.string().length(10, "Commercial Registration No must be exactly 10 digits").regex(/^\d+$/, "Must contain only digits"),
  unifiedNo: z.string().length(10, "Unified No must be exactly 10 digits").regex(/^\d+$/, "Must contain only digits"),
  vatNo: z.string().length(14, "VAT No must be exactly 14 digits").regex(/^\d+$/, "Must contain only digits"),
  province: z.string().min(1, "Province is required"),
  city: z.string().min(1, "City is required"),
  neighborName: z.string().min(1, "Neighbor name is required"),
  buildingNo: z.string().length(4, "Building No must be exactly 4 digits").regex(/^\d+$/, "Must contain only digits"),
  additionalNo: z.string().length(4, "Additional No must be exactly 4 digits").regex(/^\d+$/, "Must contain only digits"),
  postalCode: z.string().length(5, "Postal Code must be exactly 5 digits").regex(/^\d+$/, "Must contain only digits"),
  responseName: z.string().optional(),
  responseNo: z.string().optional(),
}).refine((data) => data.commercialNameAr || data.commercialNameEn, {
  message: "At least one commercial name (Arabic or English) is required",
  path: ["commercialNameAr"],
});

type CustomerInfoForm = z.infer<typeof customerInfoSchema>;

// Saudi Arabia provinces and cities
const saudiProvinces = [
  { value: "riyadh", label: "Riyadh الرياض", labelAr: "الرياض" },
  { value: "makkah", label: "Makkah مكة المكرمة", labelAr: "مكة المكرمة" },
  { value: "eastern", label: "Eastern Province المنطقة الشرقية", labelAr: "المنطقة الشرقية" },
  { value: "asir", label: "Asir عسير", labelAr: "عسير" },
  { value: "madinah", label: "Madinah المدينة المنورة", labelAr: "المدينة المنورة" },
  { value: "qassim", label: "Qassim القصيم", labelAr: "القصيم" },
  { value: "hail", label: "Hail حائل", labelAr: "حائل" },
  { value: "tabuk", label: "Tabuk تبوك", labelAr: "تبوك" },
  { value: "northern", label: "Northern Borders الحدود الشمالية", labelAr: "الحدود الشمالية" },
  { value: "jazan", label: "Jazan جازان", labelAr: "جازان" },
  { value: "najran", label: "Najran نجران", labelAr: "نجران" },
  { value: "albaha", label: "Al Bahah الباحة", labelAr: "الباحة" },
  { value: "jouf", label: "Al Jouf الجوف", labelAr: "الجوف" },
];

const citiesByProvince: Record<string, Array<{ value: string; label: string; labelAr: string }>> = {
  riyadh: [
    { value: "riyadh_city", label: "Riyadh الرياض", labelAr: "الرياض" },
    { value: "alkharj", label: "Al Kharj الخرج", labelAr: "الخرج" },
    { value: "alduwadimi", label: "Al Duwadimi الدوادمي", labelAr: "الدوادمي" },
    { value: "almajmaah", label: "Al Majma'ah المجمعة", labelAr: "المجمعة" },
    { value: "alquwayiyah", label: "Al Quwayiyah القويعية", labelAr: "القويعية" },
  ],
  makkah: [
    { value: "makkah_city", label: "Makkah مكة المكرمة", labelAr: "مكة المكرمة" },
    { value: "jeddah", label: "Jeddah جدة", labelAr: "جدة" },
    { value: "taif", label: "Taif الطائف", labelAr: "الطائف" },
    { value: "rabigh", label: "Rabigh رابغ", labelAr: "رابغ" },
    { value: "yanbu", label: "Yanbu ينبع", labelAr: "ينبع" },
  ],
  eastern: [
    { value: "dammam", label: "Dammam الدمام", labelAr: "الدمام" },
    { value: "khobar", label: "Al Khobar الخبر", labelAr: "الخبر" },
    { value: "dhahran", label: "Dhahran الظهران", labelAr: "الظهران" },
    { value: "jubail", label: "Jubail الجبيل", labelAr: "الجبيل" },
    { value: "qatif", label: "Qatif القطيف", labelAr: "القطيف" },
  ],
  // Add more cities for other provinces as needed
};

const neighborhoodsByCity: Record<string, Array<{ value: string; label: string; labelAr: string }>> = {
  riyadh_city: [
    { value: "olaya", label: "Olaya العليا", labelAr: "العليا" },
    { value: "malaz", label: "Malaz الملز", labelAr: "الملز" },
    { value: "sulaymaniyah", label: "Sulaymaniyah السليمانية", labelAr: "السليمانية" },
    { value: "naseem", label: "Naseem النسيم", labelAr: "النسيم" },
    { value: "murabba", label: "Murabba المربع", labelAr: "المربع" },
  ],
  jeddah: [
    { value: "alsalamah", label: "Al Salamah السلامة", labelAr: "السلامة" },
    { value: "alrawdah", label: "Al Rawdah الروضة", labelAr: "الروضة" },
    { value: "alsharafiyah", label: "Al Sharafiyah الشرفية", labelAr: "الشرفية" },
    { value: "alkandara", label: "Al Kandara الكندرة", labelAr: "الكندرة" },
    { value: "alhamra", label: "Al Hamra الحمراء", labelAr: "الحمراء" },
  ],
  dammam: [
    { value: "alalama", label: "Al Alama العلاما", labelAr: "العلاما" },
    { value: "aldana", label: "Al Dana الدانة", labelAr: "الدانة" },
    { value: "alfaisaliyah", label: "Al Faisaliyah الفيصلية", labelAr: "الفيصلية" },
    { value: "almanar", label: "Al Manar المنار", labelAr: "المنار" },
    { value: "alzahran", label: "Al Zahran الزهران", labelAr: "الزهران" },
  ],
  // Add more neighborhoods for other cities as needed
};

// Simple translation service (for demonstration)
const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
  // In a real application, you would use a translation service like Google Translate API
  // For now, return the original text as a placeholder
  return text;
};

export default function CustomerInfoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerInfoForm>({
    resolver: zodResolver(customerInfoSchema),
  });

  const watchedCommercialNameAr = watch("commercialNameAr");
  const watchedCommercialNameEn = watch("commercialNameEn");

  // Auto-translation logic
  const handleNameChange = async (field: "commercialNameAr" | "commercialNameEn", value: string) => {
    setValue(field, value);
    
    if (value && value.length > 2) {
      try {
        if (field === "commercialNameAr" && !watchedCommercialNameEn) {
          const translated = await translateText(value, "ar", "en");
          setValue("commercialNameEn", translated);
        } else if (field === "commercialNameEn" && !watchedCommercialNameAr) {
          const translated = await translateText(value, "en", "ar");
          setValue("commercialNameAr", translated);
        }
      } catch (error) {
        // Translation failed, continue without auto-fill
        console.log("Translation failed:", error);
      }
    }
  };

  const submitMutation = useMutation({
    mutationFn: async (data: CustomerInfoForm) => {
      const response = await fetch("/api/customer-information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit customer information");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Success تم بنجاح",
        description: "Your information has been submitted successfully. معلوماتك تم إرسالها بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CustomerInfoForm) => {
    submitMutation.mutate(data);
  };

  const availableCities = selectedProvince ? citiesByProvince[selectedProvince] || [] : [];
  const availableNeighborhoods = selectedCity ? neighborhoodsByCity[selectedCity] || [] : [];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Thank you! <span className="font-arabic font-bold">شكراً لك!</span>
            </h2>
            <p className="text-gray-600">
              Your information has been submitted successfully.
              <br />
              <span className="font-arabic font-bold">معلوماتك تم إرسالها بنجاح.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header with Welcome Message and Logo */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8 text-center">
          

          {/* Company Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center">
              <img
                src="/assets/company-logo.png"
                alt="Modern Plastic Bag Factory Logo"
                className="w-28 h-28 object-contain"
                onError={(e) => {
                  // Fallback to styled div if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-white text-center">
                        <div class="text-xs font-bold">MODERN</div>
                        <div class="text-xs font-bold">PLASTIC BAG</div>
                        <div class="text-xs font-bold">FACTORY</div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>

          <p className="text-lg text-gray-700">
            Please fill out your business information below
          </p>
          <p className="text-lg text-gray-700 font-arabic font-bold">
            يرجى تعبئة معلومات شركتكم أدناه
          </p>
        </div>
      </div>
      {/* Main Form */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-green-800">
              Customer Information <span className="font-arabic font-bold">معلومات العميل</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Commercial Names */}
              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <Label
                    htmlFor="commercialNameAr"
                    className="text-lg font-semibold text-right"
                  >
                    <span className="font-arabic font-bold text-center pl-[70px] pr-[70px] ml-[0px] mr-[0px] text-[16px]">الاسم التجاري بالعربية</span>
                  </Label>
                  <Input
                    id="commercialNameAr"
                    {...register("commercialNameAr")}
                    onChange={(e) =>
                      handleNameChange("commercialNameAr", e.target.value)
                    }
                    className="mt-2 text-lg py-3 font-arabic text-center"
                    placeholder="مصنع أكياس الحديث للمنتجات البلاستيكية"
                    dir="rtl"
                  />
                  {errors.commercialNameAr && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.commercialNameAr.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Registration Numbers */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label
                    htmlFor="commercialRegistrationNo"
                    className="text-lg font-semibold"
                  >
                    CR No. *
                    <span className="block font-arabic text-[16px] text-center text-[#000000] font-semibold">
                      رقم السجل التجاري
                    </span>
                  </Label>
                  <Input
                    id="commercialRegistrationNo"
                    {...register("commercialRegistrationNo")}
                    className="mt-2 text-lg py-3 text-center"
                    placeholder="2050052901"
                    maxLength={10}
                  />
                  {errors.commercialRegistrationNo && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.commercialRegistrationNo.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="unifiedNo" className="text-lg font-semibold">
                    Unified No. *
                    <span className="block font-arabic text-[16px] text-center text-[#000000] font-semibold">
                      الرقم الموحد
                    </span>
                  </Label>
                  <Input
                    id="unifiedNo"
                    {...register("unifiedNo")}
                    className="mt-2 text-lg py-3 text-center"
                    placeholder="7007685592"
                    maxLength={10}
                  />
                  {errors.unifiedNo && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.unifiedNo.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="vatNo" className="text-lg font-semibold">
                    VAT No. *
                  </Label>
                  <Input
                    id="vatNo"
                    {...register("vatNo")}
                    className="mt-2 text-lg py-3 text-center"
                    placeholder="300511028200003"
                    maxLength={14}
                  />
                  {errors.vatNo && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.vatNo.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-green-700 text-center">
                  Address Information <span className="font-arabic font-bold">معلومات العنوان</span>
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="province" className="text-lg font-semibold">
                      Province *
                    </Label>
                    <Select
                      value={selectedProvince}
                      onValueChange={(value) => {
                        setSelectedProvince(value);
                        setSelectedCity("");
                        setValue("province", value);
                        setValue("city", "");
                        setValue("neighborName", "");
                      }}
                    >
                      <SelectTrigger className="mt-2 text-lg py-3 text-center">
                        <SelectValue placeholder="اختر المنطقة" />
                      </SelectTrigger>
                      <SelectContent>
                        {saudiProvinces.map((province) => (
                          <SelectItem
                            key={province.value}
                            value={province.value}
                          >
                            {province.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.province && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.province.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-lg font-semibold">
                      City *
                    </Label>
                    <Select
                      value={selectedCity}
                      onValueChange={(value) => {
                        setSelectedCity(value);
                        setValue("city", value);
                        setValue("neighborName", "");
                      }}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger className="mt-2 text-lg py-3 text-center">
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="neighborName"
                      className="text-lg font-semibold"
                    >
                      Neighborhood *
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("neighborName", value)}
                      disabled={!selectedCity}
                    >
                      <SelectTrigger className="mt-2 text-lg py-3 text-center">
                        <SelectValue placeholder="اختر الحي" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableNeighborhoods.map((neighborhood) => (
                          <SelectItem
                            key={neighborhood.value}
                            value={neighborhood.value}
                          >
                            {neighborhood.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.neighborName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.neighborName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <Label
                      htmlFor="buildingNo"
                      className="text-lg font-semibold"
                    >
                      Building No. *
                    </Label>
                    <Input
                      id="buildingNo"
                      {...register("buildingNo")}
                      className="mt-2 text-lg py-3 text-center"
                      placeholder="3865"
                      maxLength={4}
                    />
                    {errors.buildingNo && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.buildingNo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      id="additionalNo"
                      {...register("additionalNo")}
                      className="mt-2 text-lg py-3 text-center"
                      placeholder="7760"
                      maxLength={4}
                    />
                    {errors.additionalNo && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.additionalNo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="postalCode"
                      className="text-lg font-semibold"
                    >
                      Postal Code *
                    </Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      className="mt-2 text-lg py-3 text-center"
                      placeholder="32432"
                      maxLength={5}
                    />
                    {errors.postalCode && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-green-700 text-center">
                  Contact Information <span className="font-arabic font-bold">معلومات الاتصال</span>
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="responseName"
                      className="text-lg font-semibold"
                    >
                      Response Name
                    </Label>
                    <Input
                      id="responseName"
                      {...register("responseName")}
                      className="mt-2 text-lg py-3 text-center"
                      placeholder="الاسم الكامل"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="responseNo"
                      className="text-lg font-semibold"
                    >
                      Response No.
                    </Label>
                    <Input
                      id="responseNo"
                      {...register("responseNo")}
                      className="mt-2 text-lg py-3 text-center"
                      placeholder="+966 532044751"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-bold rounded-lg shadow-lg"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting... <span className="font-arabic font-bold">جاري الإرسال</span>
                    </>
                  ) : (
                    <span className="font-arabic font-bold">إرسال المعلومات</span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}