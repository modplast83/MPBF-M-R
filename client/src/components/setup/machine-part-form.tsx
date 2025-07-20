import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertMachinePartSchema, Section, MachinePart, Machine } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants";

// Define the form schema
const machinePartFormSchema = insertMachinePartSchema.extend({
  machineName: z.string().min(1, "Machine name is required"),
  sectionId: z.string().optional(),
  partType: z.enum(["Mechanic", "Electronic"], {
    required_error: "Part type is required",
  }),
  name: z.string().min(1, "Part name is required"),
  code: z.string().min(1, "Part code is required"),
  serialNumber: z.string().optional(),
  size: z.string().optional(),
  sizeUnit: z.enum(["cm", "inch", "mm"]).optional(),
  sizeValue: z.number().optional(),
  note: z.string().optional(),
  lastMaintenanceDate: z.string().optional(),
});

type MachinePartFormData = z.infer<typeof machinePartFormSchema>;

interface MachinePartFormProps {
  onSubmit: (data: MachinePartFormData) => void;
  onCancel: () => void;
  initialData?: MachinePart | null;
  isLoading?: boolean;
}

export function MachinePartForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}: MachinePartFormProps) {
  const { t } = useTranslation();

  // Fetch sections and machines for the dropdowns
  const { data: sections = [] } = useQuery<Section[]>({
    queryKey: [API_ENDPOINTS.SECTIONS],
  });

  const { data: machines = [] } = useQuery<Machine[]>({
    queryKey: [API_ENDPOINTS.MACHINES],
  });

  const form = useForm<MachinePartFormData>({
    resolver: zodResolver(machinePartFormSchema),
    defaultValues: {
      machineName: initialData?.machineName || "",
      sectionId: initialData?.sectionId || undefined,
      partType: initialData?.partType as "Mechanic" | "Electronic" || undefined,
      name: initialData?.name || "",
      code: initialData?.code || "",
      serialNumber: initialData?.serialNumber || "",
      size: initialData?.size || "",
      sizeUnit: initialData?.sizeUnit as "cm" | "inch" | "mm" || undefined,
      sizeValue: initialData?.sizeValue || undefined,
      note: initialData?.note || "",
      lastMaintenanceDate: initialData?.lastMaintenanceDate
        ? new Date(initialData.lastMaintenanceDate).toISOString().split("T")[0]
        : "",
    },
  });

  const handleSubmit = (data: MachinePartFormData) => {
    // Convert the form data to match the expected format
    const submitData = {
      ...data,
      sizeValue: data.sizeValue ? Number(data.sizeValue) : null,
      lastMaintenanceDate: data.lastMaintenanceDate
        ? new Date(data.lastMaintenanceDate).toISOString()
        : null,
    };
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Machine Name */}
          <FormField
            control={form.control}
            name="machineName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.machine_name")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("setup.machine_parts.form.select_machine")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {machines.map((machine) => (
                      <SelectItem key={machine.id} value={machine.name}>
                        {machine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section */}
          <FormField
            control={form.control}
            name="sectionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.section")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("common.select")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Part Type */}
          <FormField
            control={form.control}
            name="partType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.part_type")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("setup.machine_parts.form.select_part_type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Mechanic">
                      {t("setup.machine_parts.part_type_mechanic")}
                    </SelectItem>
                    <SelectItem value="Electronic">
                      {t("setup.machine_parts.part_type_electronic")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Part Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.part_name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("setup.machine_parts.form.part_name_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Part Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.part_code")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("setup.machine_parts.form.part_code_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Serial Number */}
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.serial_number")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("setup.machine_parts.form.serial_number_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.size")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("setup.machine_parts.form.size_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size Unit */}
          <FormField
            control={form.control}
            name="sizeUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.size_unit")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("setup.machine_parts.form.select_size_unit")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cm">
                      {t("setup.machine_parts.size_unit_cm")}
                    </SelectItem>
                    <SelectItem value="inch">
                      {t("setup.machine_parts.size_unit_inch")}
                    </SelectItem>
                    <SelectItem value="mm">
                      {t("setup.machine_parts.size_unit_mm")}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size Value */}
          <FormField
            control={form.control}
            name="sizeValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.size_value")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t("setup.machine_parts.form.size_value_placeholder")}
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Maintenance Date */}
          <FormField
            control={form.control}
            name="lastMaintenanceDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("setup.machine_parts.last_maintenance_date")}</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("setup.machine_parts.note")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("setup.machine_parts.form.note_placeholder")}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("common.saving") : t("common.save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}