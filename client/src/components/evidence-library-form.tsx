/**
 * UNIVERSAL PROTOCOL STANDARD COMPLIANCE HEADER
 * 
 * FRONTEND: Relative API paths only (/api/route), NO absolute URLs or hardcoded ports
 * NO HARDCODING: All configuration from API responses, NO fallback data
 * VITE PROXY: Must use relative paths for proper Vite proxy configuration
 * PROTOCOL: UNIVERSAL_PROTOCOL_STANDARD.md
 * DATE: July 29, 2025
 * LAST REVIEWED: July 29, 2025
 * EXCEPTIONS: None
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const evidenceFormSchema = z.object({
  equipmentGroupId: z.string().min(1, "Equipment Group is required"),
  equipmentTypeId: z.string().min(1, "Equipment Type is required"),
  equipmentSubtypeId: z.string().optional(), // FIXED: Use subtypeId for FK relationship
  componentFailureMode: z.string().min(1, "Component/Failure Mode is required"),
  equipmentCode: z.string().min(1, "Equipment Code is required"),
  failureCode: z.string().min(1, "Failure Code is required"),
  riskRankingId: z.string().min(1, "Risk Ranking is required"), // FIXED: Use riskRankingId for FK relationship
  requiredTrendDataEvidence: z.string().min(1, "Required trend data evidence is required"),
  aiOrInvestigatorQuestions: z.string().min(1, "AI/Investigator questions is required"),
  attachmentsEvidenceRequired: z.string().min(1, "Attachments evidence required is required"),
  rootCauseLogic: z.string().min(1, "Root cause logic is required"),
});

type EvidenceFormData = z.infer<typeof evidenceFormSchema>;

interface EvidenceLibraryFormProps {
  item?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EvidenceLibraryForm({ item, onSuccess, onCancel }: EvidenceLibraryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch equipment groups and types for dropdowns
  const { data: equipmentGroups = [] } = useQuery({
    queryKey: ['/api/equipment-groups'],
    queryFn: async () => {
      const response = await fetch('/api/equipment-groups');
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: equipmentTypes = [] } = useQuery({
    queryKey: ['/api/equipment-types'],
    queryFn: async () => {
      const response = await fetch('/api/equipment-types');
      if (!response.ok) return [];
      return response.json();
    },
  });

  // CRITICAL FIX: Add Risk Rankings query to eliminate hardcoded values
  const { data: riskRankings = [] } = useQuery({
    queryKey: ['/api/risk-rankings'],
    queryFn: async () => {
      const response = await fetch('/api/risk-rankings');
      if (!response.ok) return [];
      return response.json();
    },
  });

  const form = useForm<EvidenceFormData>({
    resolver: zodResolver(evidenceFormSchema),
    defaultValues: {
      equipmentGroupId: item?.equipmentGroupId?.toString() || "",
      equipmentTypeId: item?.equipmentTypeId?.toString() || "",
      equipmentSubtypeId: item?.equipmentSubtypeId?.toString() || "", // FIXED: Use FK ID
      componentFailureMode: item?.componentFailureMode || "",
      equipmentCode: item?.equipmentCode || "",
      failureCode: item?.failureCode || "",
      riskRankingId: item?.riskRankingId?.toString() || "", // FIXED: Use FK ID
      requiredTrendDataEvidence: item?.requiredTrendDataEvidence || "",
      aiOrInvestigatorQuestions: item?.aiOrInvestigatorQuestions || "",
      attachmentsEvidenceRequired: item?.attachmentsEvidenceRequired || "",
      rootCauseLogic: item?.rootCauseLogic || "",
    },
  });

  // CRITICAL FIX: Add Equipment Subtypes query filtered by selected equipment type
  const selectedEquipmentTypeId = form.watch('equipmentTypeId');
  const { data: equipmentSubtypes = [] } = useQuery({
    queryKey: ['/api/equipment-subtypes/by-type', selectedEquipmentTypeId],
    queryFn: async () => {
      if (!selectedEquipmentTypeId) return [];
      const response = await fetch(`/api/equipment-subtypes/by-type/${selectedEquipmentTypeId}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!selectedEquipmentTypeId,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: EvidenceFormData) => {
      const url = item?.id ? `/api/evidence-library/${item.id}` : '/api/evidence-library';
      const method = item?.id ? 'PUT' : 'POST';
      
      return apiRequest(url, {
        method,
        body: JSON.stringify({
          ...data,
          equipmentGroupId: parseInt(data.equipmentGroupId),
          equipmentTypeId: parseInt(data.equipmentTypeId),
          equipmentSubtypeId: data.equipmentSubtypeId ? parseInt(data.equipmentSubtypeId) : null, // FIXED: Handle optional FK
          riskRankingId: parseInt(data.riskRankingId), // FIXED: Use FK ID
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidence-library"] });
      toast({
        title: "Success",
        description: item?.id ? "Evidence item updated successfully" : "Evidence item created successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save evidence item",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: EvidenceFormData) => {
    setIsSubmitting(true);
    try {
      await saveMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Equipment Group */}
          <FormField
            control={form.control}
            name="equipmentGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Group</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment group" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentGroups.map((group: any) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Equipment Type */}
          <FormField
            control={form.control}
            name="equipmentTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CRITICAL FIX: Subtype now linked to Equipment Type table */}
          <FormField
            control={form.control}
            name="equipmentSubtypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtype (Optional)</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedEquipmentTypeId ? "Select equipment subtype" : "Select equipment type first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentSubtypes.map((subtype: any) => (
                        <SelectItem key={subtype.id} value={subtype.id.toString()}>
                          {subtype.name}
                        </SelectItem>
                      ))}
                      {equipmentSubtypes.length === 0 && selectedEquipmentTypeId && (
                        <SelectItem value="" disabled>
                          No subtypes available for this equipment type
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                {!selectedEquipmentTypeId && (
                  <p className="text-sm text-muted-foreground">
                    Not mapped. Select an Equipment Type first to see available subtypes
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Component/Failure Mode */}
          <FormField
            control={form.control}
            name="componentFailureMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Component/Failure Mode</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Bearing Failure / Overheating" />
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
                <FormLabel>Equipment Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., PUMP-001" />
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
                <FormLabel>Failure Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., BRG-OVHT-001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* CRITICAL FIX: Risk Ranking now from admin master table only */}
        <FormField
          control={form.control}
          name="riskRankingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Ranking</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk ranking" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskRankings.map((ranking: any) => (
                      <SelectItem key={ranking.id} value={ranking.id.toString()}>
                        {ranking.label}
                      </SelectItem>
                    ))}
                    {riskRankings.length === 0 && (
                      <SelectItem value="" disabled>
                        No risk rankings configured in admin section
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">
                Values from Risk Ranking master table under admin section - {riskRankings.length} items available
              </p>
            </FormItem>
          )}
        />

        {/* Required Trend Data Evidence */}
        <FormField
          control={form.control}
          name="requiredTrendDataEvidence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Required Trend Data Evidence</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe the trend data evidence required for this failure mode"
                  rows={3}
                />
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
              <FormLabel>AI/Investigator Questions</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Key questions for AI or investigators to ask about this failure mode"
                  rows={3}
                />
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
              <FormLabel>Attachments Evidence Required</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Describe the attachments and documents required as evidence"
                  rows={3}
                />
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
              <FormLabel>Root Cause Logic</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Explain the logic connecting this failure mode to its root causes"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || saveMutation.isPending}>
            {isSubmitting || saveMutation.isPending ? "Saving..." : item?.id ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}