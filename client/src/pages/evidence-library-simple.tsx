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

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const { data: evidenceItems = [], isLoading } = useQuery<EvidenceLibrary[]>({
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

  const handleItemSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Evidence Library Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-red-600 mb-4 bg-red-50 p-3 rounded border border-red-200">
            🚨 <strong>STEP 2 CRITICAL TEST:</strong> WORKING HORIZONTAL SCROLL - Table width 20000px with ALL 43 COLUMNS visible. Fixed column widths force horizontal scrolling.
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
              <TableHeader>
                <TableRow>
                  <TableHead style={{ width: '80px', minWidth: '80px' }}>Select</TableHead>
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
                ) : evidenceItems.length === 0 ? (
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
                  evidenceItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleItemSelect(item.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.equipmentGroup === "DELETED" ? "Unknown" : item.equipmentGroup}</TableCell>
                      <TableCell>{item.equipmentType === "DELETED" ? "Unknown" : item.equipmentType}</TableCell>
                      <TableCell>{item.subtype || '-'}</TableCell>
                      <TableCell>{item.componentFailureMode}</TableCell>
                      <TableCell>{item.equipmentCode}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm">
                          {item.failureCode}
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
                      <TableCell className="truncate">{item.requiredTrendDataEvidence || '-'}</TableCell>
                      <TableCell className="truncate">{item.aiOrInvestigatorQuestions || '-'}</TableCell>
                      <TableCell className="truncate">{item.attachmentsEvidenceRequired || '-'}</TableCell>
                      <TableCell className="truncate">{item.rootCauseLogic || '-'}</TableCell>
                      <TableCell className="truncate">{item.primaryRootCause || '-'}</TableCell>
                      <TableCell className="truncate">{item.contributingFactor || '-'}</TableCell>
                      <TableCell className="truncate">{item.latentCause || '-'}</TableCell>
                      <TableCell className="truncate">{item.detectionGap || '-'}</TableCell>
                      <TableCell className="truncate">{item.confidenceLevel || '-'}</TableCell>
                      <TableCell className="truncate">{item.faultSignaturePattern || '-'}</TableCell>
                      <TableCell className="truncate">{item.applicableToOtherEquipment || '-'}</TableCell>
                      <TableCell className="truncate">{item.evidenceGapFlag || '-'}</TableCell>
                      <TableCell className="truncate">{item.eliminatedIfTheseFailuresConfirmed || '-'}</TableCell>
                      <TableCell className="truncate">{item.whyItGetsEliminated || '-'}</TableCell>
                      <TableCell className="truncate">{item.diagnosticValue || '-'}</TableCell>
                      <TableCell className="truncate">{item.industryRelevance || '-'}</TableCell>
                      <TableCell className="truncate">{item.evidencePriority || '-'}</TableCell>
                      <TableCell className="truncate">{item.timeToCollect || '-'}</TableCell>
                      <TableCell className="truncate">{item.collectionCost || '-'}</TableCell>
                      <TableCell className="truncate">{item.analysisComplexity || '-'}</TableCell>
                      <TableCell className="truncate">{item.seasonalFactor || '-'}</TableCell>
                      <TableCell className="truncate">{item.relatedFailureModes || '-'}</TableCell>
                      <TableCell className="truncate">{item.prerequisiteEvidence || '-'}</TableCell>
                      <TableCell className="truncate">{item.followupActions || '-'}</TableCell>
                      <TableCell className="truncate">{item.industryBenchmark || '-'}</TableCell>
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