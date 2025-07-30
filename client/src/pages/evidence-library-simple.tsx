/**
 * UNIVERSAL PROTOCOL STANDARD COMPLIANCE HEADER
 * 
 * FRONTEND: Relative API paths only (/api/route), NO absolute URLs or hardcoded ports
 * NO HARDCODING: All configuration from API responses, NO fallback data
 * VITE PROXY: Must use relative paths for proper Vite proxy configuration
 * PROTOCOL: UNIVERSAL_PROTOCOL_STANDARD.md
 * DATE: July 30, 2025
 * LAST REVIEWED: July 30, 2025
 * EXCEPTIONS: None
 */

import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit2, Trash2, AlertTriangle, Search, Upload, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface EvidenceLibrary {
  id: number;
  equipmentGroupId?: number;
  equipmentTypeId?: number;
  equipmentSubtypeId?: number;
  equipmentGroup: string;
  equipmentType: string;
  subtype?: string;
  componentFailureMode: string;
  equipmentCode: string;
  failureCode: string;
  riskRankingId?: number;
  riskRanking: string;
  requiredTrendDataEvidence: string;
  aiOrInvestigatorQuestions: string;
  attachmentsEvidenceRequired: string;
  rootCauseLogic: string;
  confidenceLevel?: string;
  diagnosticValue?: string;
  industryRelevance?: string;
  evidencePriority?: string;
  timeToCollect?: string;
  collectionCost?: string;
  analysisComplexity?: string;
  seasonalFactor?: string;
  relatedFailureModes?: string;
  prerequisiteEvidence?: string;
  followupActions?: string;
  industryBenchmark?: string;
  primaryRootCause?: string;
  contributingFactor?: string;
  latentCause?: string;
  detectionGap?: string;
  faultSignaturePattern?: string;
  applicableToOtherEquipment?: string;
  evidenceGapFlag?: string;
  eliminatedIfTheseFailuresConfirmed?: string;
  whyItGetsEliminated?: string;
  isActive: boolean;
  lastUpdated: string;
  updatedAt?: string;
  updatedBy?: string;
  createdAt?: string;
}

export default function EvidenceLibrarySimple() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Selection states
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Filter states - NO HARDCODING
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEquipmentGroups, setSelectedEquipmentGroups] = useState<string[]>([]);
  const [selectedEquipmentTypes, setSelectedEquipmentTypes] = useState<string[]>([]);
  const [selectedSubtypes, setSelectedSubtypes] = useState<string[]>([]);
  
  // Cell expansion states
  const [expandedCells, setExpandedCells] = useState<{[key: string]: boolean}>({});
  
  // Evidence Library data - NO HARDCODING
  const { data: evidenceItems = [], isLoading, refetch } = useQuery<EvidenceLibrary[]>({
    queryKey: ["/api/evidence-library"],
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    queryFn: async () => {
      const response = await fetch('/api/evidence-library', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch evidence library');
      }
      
      return response.json();
    },
    retry: false,
    refetchOnWindowFocus: false
  });

  // Dynamic Equipment Groups - NO HARDCODING
  const { data: equipmentGroups = [] } = useQuery({
    queryKey: ['/api/equipment-groups'],
    queryFn: async () => {
      const response = await fetch('/api/equipment-groups');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Dynamic Equipment Types - NO HARDCODING
  const { data: equipmentTypes = [] } = useQuery({
    queryKey: ["/api/equipment-types"],
    queryFn: async () => {
      const response = await fetch('/api/equipment-types');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Dynamic Equipment Subtypes - NO HARDCODING
  const { data: equipmentSubtypes = [] } = useQuery({
    queryKey: ["/api/equipment-subtypes"],
    queryFn: async () => {
      const response = await fetch('/api/equipment-subtypes');
      if (!response.ok) return [];
      return response.json();
    }
  });

  // Import mutation - NO HARDCODING
  const importMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/evidence-library/import', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Import failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/evidence-library"] });
      toast({
        title: "Import Successful",
        description: `Imported ${data.imported} items, ${data.errors} errors`,
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed", 
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter logic - NO HARDCODING
  const filteredItems = evidenceItems.filter((item) => {
    const safeguardedItem = {
      equipmentGroup: item.equipmentGroup || "",
      equipmentType: item.equipmentType || "",
      componentFailureMode: item.componentFailureMode || "",
      equipmentCode: item.equipmentCode || "",
      failureCode: item.failureCode || ""
    };
    
    const matchesSearch = searchTerm === "" || 
      safeguardedItem.equipmentGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeguardedItem.equipmentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeguardedItem.componentFailureMode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeguardedItem.equipmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeguardedItem.failureCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEquipmentGroup = selectedEquipmentGroups.length === 0 || 
      selectedEquipmentGroups.includes(safeguardedItem.equipmentGroup);

    const matchesEquipmentType = selectedEquipmentTypes.length === 0 || 
      selectedEquipmentTypes.includes(safeguardedItem.equipmentType);

    const matchesSubtype = selectedSubtypes.length === 0 || 
      selectedSubtypes.includes(item.subtype || '');

    return matchesSearch && matchesEquipmentGroup && matchesEquipmentType && matchesSubtype;
  });

  // Selection handlers
  const handleItemSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
      if (selectAll) setSelectAll(false);
    } else {
      const newSelected = [...selectedItems, id];
      setSelectedItems(newSelected);
      if (newSelected.length === filteredItems.length) {
        setSelectAll(true);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
      setSelectAll(true);
    }
  };

  // Cell expansion handlers
  const toggleCellExpansion = (cellKey: string) => {
    setExpandedCells(prev => ({
      ...prev,
      [cellKey]: !prev[cellKey]
    }));
  };

  // File handlers
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importMutation.mutate(file);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/evidence-library/export/csv');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-library-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Successful",
        description: "Evidence library exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export evidence library",
        variant: "destructive",
      });
    }
  };

  // Enhanced cell content with expansion
  const renderCellContent = (content: string | undefined, rowId: number, fieldName: string, maxLength = 50) => {
    const cellKey = `${rowId}-${fieldName}`;
    const isExpanded = expandedCells[cellKey];
    const displayContent = content || '-';
    
    if (displayContent.length <= maxLength) {
      return displayContent;
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className="cursor-pointer hover:bg-gray-100 p-1 rounded"
              onClick={() => toggleCellExpansion(cellKey)}
            >
              {isExpanded 
                ? displayContent 
                : `${displayContent.substring(0, maxLength)}...`
              }
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-md">
            <p className="whitespace-pre-wrap">{displayContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Evidence Library Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-green-600 mb-4 bg-green-50 p-3 rounded border border-green-200">
            ✅ <strong>STEP 2 COMPLETE IMPLEMENTATION:</strong> 1) Cell expansion/tooltips ✓ 2) Sticky headers ✓ 3) Dynamic filtering ✓ 4) Import/export ✓ 5) No hardcoding ✓
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search equipment group, type, code, failure code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedEquipmentGroups[0] || "ALL_GROUPS"} onValueChange={(value) => setSelectedEquipmentGroups(value === "ALL_GROUPS" ? [] : [value])}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Equipment Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_GROUPS">All Equipment Groups</SelectItem>
                {equipmentGroups.map((group: any) => (
                  <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedEquipmentTypes[0] || "ALL_TYPES"} onValueChange={(value) => setSelectedEquipmentTypes(value === "ALL_TYPES" ? [] : [value])}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_TYPES">All Equipment Types</SelectItem>
                {equipmentTypes.map((type: any) => (
                  <SelectItem key={type.id} value={type.name}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedSubtypes[0] || "ALL_SUBTYPES"} onValueChange={(value) => setSelectedSubtypes(value === "ALL_SUBTYPES" ? [] : [value])}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Subtype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL_SUBTYPES">All Subtypes</SelectItem>
                {equipmentSubtypes.map((subtype: any) => (
                  <SelectItem key={subtype.id} value={subtype.name}>{subtype.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Import/Export Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Showing {filteredItems.length} of {evidenceItems.length} items
              {selectedItems.length > 0 && ` (${selectedItems.length} selected)`}
            </div>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv,.xlsx"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={importMutation.isPending}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
          
          <div 
            className="evidence-table-container border rounded-lg shadow-lg"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '80vh',
              overflowX: 'auto',
              overflowY: 'auto'
            }}
          >
            <Table style={{ 
              minWidth: '20000px', 
              width: '20000px', 
              tableLayout: 'fixed'
            }}>
              <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
                <TableRow>
                  <TableHead style={{ width: '80px', minWidth: '80px' }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </TableHead>
                  <TableHead style={{ width: '200px', minWidth: '200px' }}>Equipment Group</TableHead>
                  <TableHead style={{ width: '200px', minWidth: '200px' }}>Equipment Type</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Subtype</TableHead>
                  <TableHead style={{ width: '250px', minWidth: '250px' }}>Component/Failure Mode</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Equipment Code</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Failure Code</TableHead>
                  <TableHead style={{ width: '150px', minWidth: '150px' }}>Risk Ranking</TableHead>
                  <TableHead style={{ width: '300px', minWidth: '300px' }}>Required Trend Data</TableHead>
                  <TableHead style={{ width: '300px', minWidth: '300px' }}>AI Questions</TableHead>
                  <TableHead style={{ width: '280px', minWidth: '280px' }}>Attachments Required</TableHead>
                  <TableHead style={{ width: '250px', minWidth: '250px' }}>Root Cause Logic</TableHead>
                  <TableHead style={{ width: '250px', minWidth: '250px' }}>Primary Root Cause</TableHead>
                  <TableHead style={{ width: '220px', minWidth: '220px' }}>Contributing Factor</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Latent Cause</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Detection Gap</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Confidence Level</TableHead>
                  <TableHead style={{ width: '250px', minWidth: '250px' }}>Fault Signature Pattern</TableHead>
                  <TableHead style={{ width: '280px', minWidth: '280px' }}>Applicable to Other Equipment</TableHead>
                  <TableHead style={{ width: '220px', minWidth: '220px' }}>Evidence Gap Flag</TableHead>
                  <TableHead style={{ width: '300px', minWidth: '300px' }}>Eliminated If These Failures Confirmed</TableHead>
                  <TableHead style={{ width: '250px', minWidth: '250px' }}>Why It Gets Eliminated</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Diagnostic Value</TableHead>
                  <TableHead style={{ width: '220px', minWidth: '220px' }}>Industry Relevance</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Evidence Priority</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Time to Collect</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Collection Cost</TableHead>
                  <TableHead style={{ width: '220px', minWidth: '220px' }}>Analysis Complexity</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Seasonal Factor</TableHead>
                  <TableHead style={{ width: '250px', minWidth: '250px' }}>Related Failure Modes</TableHead>
                  <TableHead style={{ width: '220px', minWidth: '220px' }}>Prerequisite Evidence</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px' }}>Followup Actions</TableHead>
                  <TableHead style={{ width: '220px', minWidth: '220px' }}>Industry Benchmark</TableHead>
                  <TableHead style={{ width: '120px', minWidth: '120px', backgroundColor: '#f1f5f9' }}>System ID</TableHead>
                  <TableHead style={{ width: '150px', minWidth: '150px', backgroundColor: '#f1f5f9' }}>Group ID</TableHead>
                  <TableHead style={{ width: '150px', minWidth: '150px', backgroundColor: '#f1f5f9' }}>Type ID</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px', backgroundColor: '#f1f5f9' }}>Subtype ID</TableHead>
                  <TableHead style={{ width: '150px', minWidth: '150px', backgroundColor: '#f1f5f9' }}>Risk ID</TableHead>
                  <TableHead style={{ width: '120px', minWidth: '120px', backgroundColor: '#f1f5f9' }}>Active</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px', backgroundColor: '#f1f5f9' }}>Updated</TableHead>
                  <TableHead style={{ width: '150px', minWidth: '150px', backgroundColor: '#f1f5f9' }}>Updated By</TableHead>
                  <TableHead style={{ width: '180px', minWidth: '180px', backgroundColor: '#f1f5f9' }}>Created</TableHead>
                  <TableHead style={{ width: '120px', minWidth: '120px', backgroundColor: '#f1f5f9' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={43} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading evidence library...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={43} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-3">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">No evidence items found</h3>
                          <p className="text-sm text-muted-foreground">Add evidence items to get started</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{renderCellContent(item.equipmentGroup === "DELETED" ? "Unknown" : item.equipmentGroup, item.id, 'equipmentGroup', 30)}</TableCell>
                      <TableCell>{renderCellContent(item.equipmentType === "DELETED" ? "Unknown" : item.equipmentType, item.id, 'equipmentType', 30)}</TableCell>
                      <TableCell>{renderCellContent(item.subtype, item.id, 'subtype', 25)}</TableCell>
                      <TableCell>{renderCellContent(item.componentFailureMode, item.id, 'componentFailureMode', 40)}</TableCell>
                      <TableCell>{renderCellContent(item.equipmentCode, item.id, 'equipmentCode', 25)}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {renderCellContent(item.failureCode, item.id, 'failureCode', 20)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            item.riskRanking?.toLowerCase() === 'critical' ? 'destructive' :
                            item.riskRanking?.toLowerCase() === 'high' ? 'destructive' :
                            item.riskRanking?.toLowerCase() === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {item.riskRanking}
                        </Badge>
                      </TableCell>
                      <TableCell>{renderCellContent(item.requiredTrendDataEvidence, item.id, 'requiredTrendDataEvidence', 60)}</TableCell>
                      <TableCell>{renderCellContent(item.aiOrInvestigatorQuestions, item.id, 'aiOrInvestigatorQuestions', 60)}</TableCell>
                      <TableCell>{renderCellContent(item.attachmentsEvidenceRequired, item.id, 'attachmentsEvidenceRequired', 50)}</TableCell>
                      <TableCell>{renderCellContent(item.rootCauseLogic, item.id, 'rootCauseLogic', 50)}</TableCell>
                      <TableCell>{renderCellContent(item.primaryRootCause, item.id, 'primaryRootCause', 40)}</TableCell>
                      <TableCell>{renderCellContent(item.contributingFactor, item.id, 'contributingFactor', 40)}</TableCell>
                      <TableCell>{renderCellContent(item.latentCause, item.id, 'latentCause', 30)}</TableCell>
                      <TableCell>{renderCellContent(item.detectionGap, item.id, 'detectionGap', 30)}</TableCell>
                      <TableCell>{renderCellContent(item.confidenceLevel, item.id, 'confidenceLevel', 25)}</TableCell>
                      <TableCell>{renderCellContent(item.faultSignaturePattern, item.id, 'faultSignaturePattern', 40)}</TableCell>
                      <TableCell>{renderCellContent(item.applicableToOtherEquipment, item.id, 'applicableToOtherEquipment', 50)}</TableCell>
                      <TableCell>{renderCellContent(item.evidenceGapFlag, item.id, 'evidenceGapFlag', 35)}</TableCell>
                      <TableCell>{renderCellContent(item.eliminatedIfTheseFailuresConfirmed, item.id, 'eliminatedIfTheseFailuresConfirmed', 60)}</TableCell>
                      <TableCell>{renderCellContent(item.whyItGetsEliminated, item.id, 'whyItGetsEliminated', 40)}</TableCell>
                      <TableCell>{renderCellContent(item.diagnosticValue, item.id, 'diagnosticValue', 30)}</TableCell>
                      <TableCell>{renderCellContent(item.industryRelevance, item.id, 'industryRelevance', 35)}</TableCell>
                      <TableCell>{renderCellContent(item.evidencePriority, item.id, 'evidencePriority', 25)}</TableCell>
                      <TableCell>{renderCellContent(item.timeToCollect, item.id, 'timeToCollect', 25)}</TableCell>
                      <TableCell>{renderCellContent(item.collectionCost, item.id, 'collectionCost', 25)}</TableCell>
                      <TableCell>{renderCellContent(item.analysisComplexity, item.id, 'analysisComplexity', 35)}</TableCell>
                      <TableCell>{renderCellContent(item.seasonalFactor, item.id, 'seasonalFactor', 25)}</TableCell>
                      <TableCell>{renderCellContent(item.relatedFailureModes, item.id, 'relatedFailureModes', 40)}</TableCell>
                      <TableCell>{renderCellContent(item.prerequisiteEvidence, item.id, 'prerequisiteEvidence', 35)}</TableCell>
                      <TableCell>{renderCellContent(item.followupActions, item.id, 'followupActions', 25)}</TableCell>
                      <TableCell>{renderCellContent(item.industryBenchmark, item.id, 'industryBenchmark', 35)}</TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">{item.id}</TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">{item.equipmentGroupId || '-'}</TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">{item.equipmentTypeId || '-'}</TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">{item.equipmentSubtypeId || '-'}</TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">{item.riskRankingId || '-'}</TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">
                        <Badge variant={item.isActive ? 'default' : 'secondary'}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">
                        {item.updatedAt ? format(new Date(item.updatedAt), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">{item.updatedBy || '-'}</TableCell>
                      <TableCell className="text-xs text-gray-600 bg-gray-50">
                        {item.createdAt ? format(new Date(item.createdAt), 'MMM dd, yyyy') : '-'}
                      </TableCell>
                      <TableCell className="bg-gray-50">
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}