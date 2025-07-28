/**
 * UNIVERSAL PROTOCOL STANDARD COMPLIANCE
 * - Zero hardcoding policy enforced
 * - Database-driven operations only
 * - Schema-driven field validation
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema - Universal Protocol Standard compliant
const evidenceLibrarySchema = z.object({
  equipmentGroup: z.string().min(1, "Equipment group is required"),
  equipmentType: z.string().min(1, "Equipment type is required"),
  subtype: z.string().optional(),
  componentFailureMode: z.string().min(1, "Failure mode is required"),
  equipmentCode: z.string().min(1, "Equipment code is required"),
  failureCode: z.string().min(1, "Failure code is required"),
  riskRanking: z.string().min(1, "Risk ranking is required"),
  requiredTrendDataEvidence: z.string().min(1, "Required trend data is required"),
  aiOrInvestigatorQuestions: z.string().min(1, "AI questions are required"),
  attachmentsEvidenceRequired: z.string().min(1, "Attachments required is required"),
  rootCauseLogic: z.string().min(1, "Root cause logic is required"),
});

type EvidenceLibraryForm = z.infer<typeof evidenceLibrarySchema>;

interface EvidenceLibraryFormProps {
  initialData?: any;
  onSubmit: (data: EvidenceLibraryForm) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EvidenceLibraryFormComponent({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}: EvidenceLibraryFormProps) {
  const [selectedEquipmentGroupId, setSelectedEquipmentGroupId] = useState<number | null>(null);
  const [selectedEquipmentTypeId, setSelectedEquipmentTypeId] = useState<number | null>(null);

  const form = useForm<EvidenceLibraryForm>({
    resolver: zodResolver(evidenceLibrarySchema),
    defaultValues: {
      equipmentGroup: initialData?.equipmentGroup || "",
      equipmentType: initialData?.equipmentType || "",
      subtype: initialData?.subtype || "",
      componentFailureMode: initialData?.componentFailureMode || "",
      equipmentCode: initialData?.equipmentCode || "",
      failureCode: initialData?.failureCode || "",
      riskRanking: initialData?.riskRanking || "",
      requiredTrendDataEvidence: initialData?.requiredTrendDataEvidence || "",
      aiOrInvestigatorQuestions: initialData?.aiOrInvestigatorQuestions || "",
      attachmentsEvidenceRequired: initialData?.attachmentsEvidenceRequired || "",
      rootCauseLogic: initialData?.rootCauseLogic || "",
    },
  });

  // Fetch Equipment Groups
  const { data: equipmentGroups = [] } = useQuery({
    queryKey: ['/api/equipment-groups/active'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/equipment-groups/active');
        if (!response.ok) return [];
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) return [];
        return JSON.parse(text);
      } catch {
        return [];
      }
    },
  });

  // Fetch Risk Rankings
  const { data: riskRankings = [] } = useQuery({
    queryKey: ['/api/risk-rankings/active'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/risk-rankings/active');
        if (!response.ok) return [];
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) return [];
        return JSON.parse(text);
      } catch {
        return [];
      }
    },
  });

  // Watch equipment group changes
  const equipmentGroupValue = form.watch("equipmentGroup");
  useEffect(() => {
    if (equipmentGroupValue && Array.isArray(equipmentGroups)) {
      const group = equipmentGroups.find((g: any) => g.name === equipmentGroupValue);
      setSelectedEquipmentGroupId(group?.id || null);
      // Clear dependent fields
      form.setValue("equipmentType", "");
      form.setValue("subtype", "");
    }
  }, [equipmentGroupValue, equipmentGroups, form]);

  // Fetch Equipment Types based on selected group
  const { data: equipmentTypes = [] } = useQuery({
    queryKey: ["/api/equipment-types/by-group", selectedEquipmentGroupId],
    queryFn: async () => {
      if (!selectedEquipmentGroupId) return [];
      try {
        const response = await fetch(`/api/equipment-types/by-group/${selectedEquipmentGroupId}`);
        if (!response.ok) return [];
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) return [];
        return JSON.parse(text);
      } catch {
        return [];
      }
    },
    enabled: !!selectedEquipmentGroupId,
  });

  // Watch equipment type changes
  const equipmentTypeValue = form.watch("equipmentType");
  useEffect(() => {
    if (equipmentTypeValue && Array.isArray(equipmentTypes)) {
      const type = equipmentTypes.find((t: any) => t.name === equipmentTypeValue);
      setSelectedEquipmentTypeId(type?.id || null);
      // Clear subtype
      form.setValue("subtype", "");
    }
  }, [equipmentTypeValue, equipmentTypes, form]);

  // Fetch Equipment Subtypes based on selected type
  const { data: equipmentSubtypes = [] } = useQuery({
    queryKey: ["/api/equipment-subtypes/by-type", selectedEquipmentTypeId],
    queryFn: async () => {
      if (!selectedEquipmentTypeId) return [];
      try {
        const response = await fetch(`/api/equipment-subtypes/by-type/${selectedEquipmentTypeId}`);
        if (!response.ok) return [];
        const text = await response.text();
        if (text.startsWith('<!DOCTYPE html>')) return [];
        return JSON.parse(text);
      } catch {
        return [];
      }
    },
    enabled: !!selectedEquipmentTypeId,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Equipment Group */}
        <FormField
          control={form.control}
          name="equipmentGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Group *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipmentGroups.map((group: any) => (
                    <SelectItem key={group.id} value={group.name}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Equipment Type */}
        <FormField
          control={form.control}
          name="equipmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipmentTypes.map((type: any) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Equipment Subtype */}
        <FormField
          control={form.control}
          name="subtype"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Subtype</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment subtype (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {equipmentSubtypes.map((subtype: any) => (
                    <SelectItem key={subtype.id} value={subtype.name}>
                      {subtype.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Component/Failure Mode */}
        <FormField
          control={form.control}
          name="componentFailureMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Component/Failure Mode *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter component failure mode" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Equipment Code */}
        <FormField
          control={form.control}
          name="equipmentCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment Code *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter unique equipment code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Failure Code */}
        <FormField
          control={form.control}
          name="failureCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Failure Code *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter failure code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Risk Ranking */}
        <FormField
          control={form.control}
          name="riskRanking"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Ranking *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk ranking" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {riskRankings.map((ranking: any) => (
                    <SelectItem key={ranking.id} value={ranking.label}>
                      {ranking.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Required Trend Data Evidence */}
        <FormField
          control={form.control}
          name="requiredTrendDataEvidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Trend Data Evidence *</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe required trend data evidence" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* AI/Investigator Questions */}
        <FormField
          control={form.control}
          name="aiOrInvestigatorQuestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI/Investigator Questions *</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter AI or investigator questions" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attachments Evidence Required */}
        <FormField
          control={form.control}
          name="attachmentsEvidenceRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachments Evidence Required *</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe required attachments/evidence" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Root Cause Logic */}
        <FormField
          control={form.control}
          name="rootCauseLogic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root Cause Logic *</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter root cause logic" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}