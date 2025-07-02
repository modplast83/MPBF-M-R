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

import FactoryLogoHPNGW_Green from "@assets/FactoryLogoHPNGW Green.png";

// Customer information form schema
const customerInfoSchema = z.object({
  commercialNameAr: z.string().optional(),
  commercialNameEn: z.string().optional(),
  commercialRegistrationNo: z.string().length(10, "Commercial Registration No must be exactly 10 digits").regex(/^\d+$/, "Must contain only digits"),
  unifiedNo: z.string().length(10, "Unified No must be exactly 10 digits").regex(/^\d+$/, "Must contain only digits"),
  vatNo: z.string().length(14, "VAT No must be exactly 14 digits").regex(/^\d+$/, "Must contain only digits"),
  province: z.string().min(1, "Province is required"),
  city: z.string().optional(),
  neighborName: z.string().optional(),
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
    { value: "other", label: "Other أخرى", labelAr: "أخرى" },
  ],
  jeddah: [
    { value: "other", label: "Other أخرى", labelAr: "أخرى" },
  ],
  dammam: [
    { value: "other", label: "Other أخرى", labelAr: "أخرى" },

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

  // Enhanced auto-translation with comprehensive business terms
  const handleNameChange = (field: "commercialNameAr" | "commercialNameEn", value: string) => {
    setValue(field, value);
    
    // Comprehensive translation mapping for business terms
    const arabicToEnglish: Record<string, string> = {
      "مصنع": "Factory",
      "شركة": "Company", 
      "مؤسسة": "Establishment",
      "تجارة": "Trading",
      "صناعة": "Manufacturing",
      "أكياس": "Bags",
      "بلاستيك": "Plastic",
      "بلاستيكية": "Plastic",
      "الحديث": "Modern",
      "الحديثة": "Modern",
      "للتجارة": "Trading",
      "التجارية": "Commercial",
      "الصناعية": "Industrial",
      "المحدودة": "Limited",
      "ذات مسؤولية محدودة": "LLC",
      "المساهمة": "Corporation",
      "التقنية": "Technology",
      "الخدمات": "Services",
      "الاستشارية": "Consulting",
      "للاستثمار": "Investment",
      "الغذائية": "Food",
      "الطبية": "Medical",
      "الهندسية": "Engineering",
      "العامة": "General",
      "الدولية": "International",
      "العربية": "Arab",
      "السعودية": "Saudi",
      "الرياض": "Riyadh",
      "جدة": "Jeddah",
      "الدمام": "Dammam",
      "مكة": "Makkah",
      "المدينة": "Madinah",
      "متقدمة": "Advanced",
      "جديدة": "New",
      "كبيرة": "Large",
      "صغيرة": "Small",
      "متوسطة": "Medium",
      "عالية": "High",
      "جودة": "Quality"
    };

    const englishToArabic: Record<string, string> = {
      "Factory": "مصنع",
      "Company": "شركة",
      "Corporation": "شركة",
      "Establishment": "مؤسسة",
      "Trading": "للتجارة",
      "Manufacturing": "صناعة",
      "Bags": "أكياس",
      "Plastic": "بلاستيك",
      "Modern": "الحديث",
      "Commercial": "التجارية",
      "Industrial": "الصناعية",
      "Limited": "المحدودة",
      "LLC": "ذات مسؤولية محدودة",
      "Technology": "التقنية",
      "Services": "الخدمات",
      "Consulting": "الاستشارية",
      "Investment": "للاستثمار",
      "Food": "الغذائية",
      "Medical": "الطبية",
      "Engineering": "الهندسية",
      "General": "العامة",
      "International": "الدولية",
      "Arab": "العربية",
      "Saudi": "السعودية",
      "Riyadh": "الرياض",
      "Jeddah": "جدة",
      "Dammam": "الدمام",
      "Makkah": "مكة",
      "Madinah": "المدينة",
      "Advanced": "متقدمة",
      "New": "جديدة", 
      "Large": "كبيرة",
      "Small": "صغيرة",
      "Medium": "متوسطة",
      "High": "عالية",
      "Quality": "جودة"
    };

    // Auto-translate when user types
    if (field === "commercialNameAr" && value.trim()) {
      let translatedText = value;
      
      // Replace Arabic words with English equivalents
      Object.entries(arabicToEnglish).forEach(([arabic, english]) => {
        const regex = new RegExp(`\\b${arabic}\\b`, 'gi');
        translatedText = translatedText.replace(regex, english);
      });
      
      // Clean up extra spaces and format properly
      translatedText = translatedText
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // Only auto-fill if English field is empty and translation is meaningful
      if (translatedText !== value && translatedText.trim() && !watchedCommercialNameEn) {
        setValue("commercialNameEn", translatedText);
      }
    } else if (field === "commercialNameEn" && value.trim()) {
      let translatedText = value;
      
      // Replace English words with Arabic equivalents
      Object.entries(englishToArabic).forEach(([english, arabic]) => {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        translatedText = translatedText.replace(regex, arabic);
      });
      
      // Clean up extra spaces
      translatedText = translatedText.replace(/\s+/g, ' ').trim();
      
      // Only auto-fill if Arabic field is empty and translation is meaningful
      if (translatedText !== value && translatedText.trim() && !watchedCommercialNameAr) {
        setValue("commercialNameAr", translatedText);
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
                src={FactoryLogoHPNGW_Green}
                alt="Modern Plastic Bag Factory Logo"
                className="w-28 h-28 object-contain ml-[0px] mr-[0px] pl-[0px] pr-[0px] pt-[0px] pb-[0px]"
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

          <p className="text-lg font-extrabold text-[#ff0000]">نموذج تحديث بيانات العميل</p>
          <p className="text-gray-700 font-arabic font-bold text-[16px]">يرجى تعبئة المعلومات التجارية أدناه</p>
        </div>
      </div>
      {/* Main Form */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-5xl mx-auto shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-center text-green-800">
              Customer Info <span className="font-arabic font-bold">معلومات العميل</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Commercial Names */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="w-full">
                    <Label htmlFor="commercialNameAr" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الاسم التجاري بالعربية *
                    </Label>
                    <Input
                      id="commercialNameAr"
                      {...register("commercialNameAr")}
                      onChange={(e) =>
                        handleNameChange("commercialNameAr", e.target.value)
                      }
                      className="text-lg py-3 font-arabic text-[14px] text-center w-full"
                      placeholder="مصنع أكياس البلاستيك الحديث"
                      dir="rtl"
                    />
                    {errors.commercialNameAr && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.commercialNameAr.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="commercialNameEn" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الإسم التجاري (En) *
                    </Label>
                    <Input
                      id="commercialNameEn"
                      {...register("commercialNameEn")}
                      onChange={(e) =>
                        handleNameChange("commercialNameEn", e.target.value)
                      }
                      className="text-lg py-3 text-[14px] text-center w-full"
                      placeholder="Modern Plastic Bag Factory"
                      dir="ltr"
                    />
                    {errors.commercialNameEn && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.commercialNameEn.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Registration Numbers */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  <div className="w-full">
                    <Label htmlFor="commercialRegistrationNo" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      رقم السجل التجاري *
                    </Label>
                    <Input
                      id="commercialRegistrationNo"
                      {...register("commercialRegistrationNo")}
                      className="text-lg py-3 text-center w-full"
                      placeholder="2050052901"
                      maxLength={10}
                    />
                    {errors.commercialRegistrationNo && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.commercialRegistrationNo.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="unifiedNo" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الرقم الموحد *
                    </Label>
                    <Input
                      id="unifiedNo"
                      {...register("unifiedNo")}
                      className="text-lg py-3 text-center w-full"
                      placeholder="7007685592"
                      maxLength={10}
                    />
                    {errors.unifiedNo && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.unifiedNo.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="vatNo" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الرقم الضريبي
                    </Label>
                    <Input
                      id="vatNo"
                      {...register("vatNo")}
                      className="text-lg py-3 text-center w-full"
                      placeholder="300511028200003"
                      maxLength={14}
                    />
                    {errors.vatNo && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.vatNo.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-green-700 text-center">
                  Address Info <span className="font-arabic font-bold">معلومات العنوان</span>
                </h3>

                {/* Location Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  <div className="w-full">
                    <Label htmlFor="province" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      المنطقة
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
                      <SelectTrigger className="text-lg py-3 text-[14px] text-center w-full">
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
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.province.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="city" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      المدينة
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
                      <SelectTrigger className="text-lg py-3 text-[14px] text-center w-full">
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
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="neighborName" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الحي
                    </Label>
                    <Select
                      onValueChange={(value) => setValue("neighborName", value)}
                      disabled={!selectedCity}
                    >
                      <SelectTrigger className="text-lg py-3 text-[14px] text-center w-full">
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
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.neighborName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  <div className="w-full">
                    <Label htmlFor="buildingNo" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      رقم المبنى
                    </Label>
                    <Input
                      id="buildingNo"
                      {...register("buildingNo")}
                      className="text-lg py-3 text-center w-full"
                      placeholder="3865"
                      maxLength={4}
                    />
                    {errors.buildingNo && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.buildingNo.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="additionalNo" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الرقم الإضافي
                    </Label>
                    <Input
                      id="additionalNo"
                      {...register("additionalNo")}
                      className="text-lg py-3 text-center w-full"
                      placeholder="7760"
                      maxLength={4}
                    />
                    {errors.additionalNo && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.additionalNo.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full sm:col-span-2 lg:col-span-1">
                    <Label htmlFor="postalCode" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الرمز البريدي
                    </Label>
                    <Input
                      id="postalCode"
                      {...register("postalCode")}
                      className="text-lg py-3 text-center w-full"
                      placeholder="32432"
                      maxLength={5}
                    />
                    {errors.postalCode && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-green-700 text-center">
                  Contact Info <span className="font-arabic font-bold">معلومات الاتصال</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="w-full">
                    <Label htmlFor="responseName" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      الشخص المسؤول
                    </Label>
                    <Input
                      id="responseName"
                      {...register("responseName")}
                      className="text-lg py-3 text-[14px] text-center w-full"
                      placeholder="الشخص المفوض"
                    />
                    {errors.responseName && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.responseName.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <Label htmlFor="responseNo" className="block text-center font-semibold text-[16px] text-[#000000] mb-2">
                      رقم التواصل
                    </Label>
                    <Input
                      id="responseNo"
                      {...register("responseNo")}
                      className="text-lg py-3 text-center w-full"
                      placeholder="05*********"
                    />
                    {errors.responseNo && (
                      <p className="text-red-600 text-sm mt-1 text-center">
                        {errors.responseNo.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-8">
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg shadow-lg w-full sm:w-auto transition-all duration-200"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      <span className="font-arabic font-bold">جاري الإرسال...</span>
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