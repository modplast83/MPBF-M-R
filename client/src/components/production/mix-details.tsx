import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { API_ENDPOINTS } from "@/lib/constants";
import { MixMaterial, MixItem, RawMaterial, User } from "@shared/schema";
import { formatDateString } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { usePermissions } from "@/hooks/use-permissions";
import { useAuth } from "@/hooks/use-auth-v2";

interface MixDetailsProps {
  mixId: number;
  rawMaterials: RawMaterial[];
  onClose?: () => void;
}

export function MixDetails({ mixId, rawMaterials, onClose }: MixDetailsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  const { user } = useAuth();
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  
  // Check if user has permission to edit/add to mix materials and is in the Extruding section
  const hasExtrudingSection = user?.sectionId && user.sectionId !== "";
  const canEdit = hasPermission("Mix Materials", "edit") && hasExtrudingSection;
  const canDelete = hasPermission("Mix Materials", "delete") && hasExtrudingSection;

  // Fetch mix details
  const { data: mix, isLoading: mixLoading } = useQuery<MixMaterial>({
    queryKey: [`${API_ENDPOINTS.MIX_MATERIALS}/${mixId}`],
  });

  // Fetch mix items
  const { data: mixItems, isLoading: itemsLoading } = useQuery<MixItem[]>({
    queryKey: [`${API_ENDPOINTS.MIX_MATERIALS}/${mixId}/items`],
  });
  
  // Fetch users to map operator IDs to names
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: [API_ENDPOINTS.USERS],
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });

  // Add mix item mutation
  const addMixItemMutation = useMutation({
    mutationFn: async (data: { mixId: number; rawMaterialId: number; quantity: number }) => {
      return apiRequest("POST", API_ENDPOINTS.MIX_ITEMS, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_ENDPOINTS.MIX_MATERIALS}/${mixId}/items`] });
      queryClient.invalidateQueries({ queryKey: [`${API_ENDPOINTS.MIX_MATERIALS}/${mixId}`] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RAW_MATERIALS] });
      setSelectedMaterial(null);
      setQuantity("");
      setIsAddingMaterial(false);
      toast({
        title: "Success",
        description: "Material added to mix successfully!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add material to mix",
        variant: "destructive",
      });
    },
  });

  // Remove mix item mutation
  const removeMixItemMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `${API_ENDPOINTS.MIX_ITEMS}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${API_ENDPOINTS.MIX_MATERIALS}/${mixId}/items`] });
      queryClient.invalidateQueries({ queryKey: [`${API_ENDPOINTS.MIX_MATERIALS}/${mixId}`] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RAW_MATERIALS] });
      toast({
        title: "Success",
        description: "Material removed from mix successfully!",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove material from mix",
        variant: "destructive",
      });
    },
  });

  const handleAddMaterial = () => {
    if (!selectedMaterial || !quantity) {
      toast({
        title: "Error",
        description: "Please select a material and enter a quantity",
        variant: "destructive",
      });
      return;
    }

    const quantityNumber = parseFloat(quantity);
    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      toast({
        title: "Error",
        description: "Quantity must be a positive number",
        variant: "destructive",
      });
      return;
    }

    addMixItemMutation.mutate({
      mixId,
      rawMaterialId: selectedMaterial,
      quantity: quantityNumber,
    });
  };

  const handleRemoveMaterial = (id: number) => {
    if (confirm("Are you sure you want to remove this material from the mix?")) {
      removeMixItemMutation.mutate(id);
    }
  };

  // Machine field no longer used

  const getRawMaterialName = (id: number) => {
    const rawMaterial = rawMaterials.find(m => m.id === id);
    return rawMaterial ? rawMaterial.name : `Material #${id}`;
  };
  
  // Function to get operator name from ID
  const getOperatorName = (operatorId: string) => {
    // If users are still loading or operatorId is empty, show loading indicator
    if (usersLoading) return `${t('common.loading')}...`;
    if (!operatorId) return t('common.not_available');
    if (!users || users.length === 0) return operatorId;
    
    const user = users.find(user => user.id === operatorId);
    if (!user) return operatorId;
    
    // Combine firstName and lastName if available
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    // Fallback to username if no name components available
    return user.username || operatorId;
  };

  // Function to generate the label content for printing
  const generatePrintableLabel = () => {
    if (!mix || !mixItems) return null;

    return (
      <div className="printable-label" style={{ width: "4in", height: "6in", padding: "0.25in", fontFamily: "Arial, sans-serif", fontSize: "12pt" }}>
        <div style={{ fontWeight: "bold", fontSize: "16pt", marginBottom: "10px", textAlign: "center", borderBottom: "2px solid #000", paddingBottom: "0.1in" }}>
          {t('production.mix_materials.mix_label')}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid #ccc", paddingBottom: "0.1in" }}>
          <div style={{ fontWeight: "bold" }}>{t('production.mix_materials.mix_id')}: {mix.id}</div>
          <div>{t('production.mix_materials.date')}: {formatDateString(mix.mixDate)}</div>
        </div>
        <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between" }}>
          <div>{t('production.mix_materials.operator')}: {getOperatorName(mix.mixPerson)}</div>
          <div style={{ fontWeight: "bold" }}>{t('production.mix_materials.total_weight')}: {mix.totalQuantity?.toFixed(2) || "0.00"} kg</div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0.3in" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold", backgroundColor: "#f3f4f6" }}>{t('production.mix_materials.material')}</th>
              <th style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold", textAlign: "right", backgroundColor: "#f3f4f6" }}>{t('production.mix_materials.quantity')}</th>
              <th style={{ border: "1px solid #000", padding: "6px", fontWeight: "bold", textAlign: "right", backgroundColor: "#f3f4f6" }}>{t('production.mix_materials.percentage')}</th>
            </tr>
          </thead>
          <tbody>
            {mixItems.map((item) => (
              <tr key={item.id}>
                <td style={{ border: "1px solid #000", padding: "6px" }}>{getRawMaterialName(item.rawMaterialId)}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "right" }}>{item.quantity.toFixed(2)}</td>
                <td style={{ border: "1px solid #000", padding: "6px", textAlign: "right" }}>{item.percentage?.toFixed(1) || "0.0"}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ borderTop: "1px solid #000", paddingTop: "0.15in", display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: "auto" }}>
          <div>{t('common.total')}: {mixItems.length}</div>
          <div>{mix.totalQuantity?.toFixed(2) || "0.00"} kg</div>
        </div>
        <div style={{ textAlign: "center", fontSize: "9pt", marginTop: "0.3in" }}>
          {new Date().toLocaleString()}<br/>
          {t('common.size')}: 4" x 6"
        </div>
      </div>
    );
  };

  if (mixLoading) {
    return <div className="flex justify-center p-4">{t('common.loading')}...</div>;
  }

  if (!mix) {
    return <div className="text-center p-4 text-secondary-400">{t('common.not_found')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t('production.mix_materials.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-medium text-secondary-500">{t('production.mix_materials.mix_id')}</div>
                  <div>{mix.id}</div>
                </div>
                <div>
                  <div className="font-medium text-secondary-500">{t('production.mix_materials.date')}</div>
                  <div>{formatDateString(mix.mixDate)}</div>
                </div>
                <div>
                  <div className="font-medium text-secondary-500">{t('production.mix_materials.operator')}</div>
                  <div className="flex items-center">
                    <span className="material-icons text-sm mr-2 text-gray-500">person</span>
                    <span>{getOperatorName(mix.mixPerson)}</span>
                  </div>
                </div>

                <div>
                  <div className="font-medium text-secondary-500">{t('production.mix_materials.total_weight')}</div>
                  <div className="font-semibold text-primary-600">{mix.totalQuantity?.toFixed(2) || "0.00"} kg</div>
                </div>
                <div>
                  <div className="font-medium text-secondary-500">{t('production.mix_materials.screw')}</div>
                  <div>{mix.mixScrew || "-"}</div>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="default" 
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.print()}
                >
                  <span className="material-icons mr-2">print</span>
                  {t('production.mix_materials.print_label')} (4" x 6")
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('production.mix_materials.add_material')}</CardTitle>
          </CardHeader>
          <CardContent>
            {isAddingMaterial ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('production.mix_materials.material')}</label>
                  <Select
                    value={selectedMaterial?.toString() || ""}
                    onValueChange={(value) => setSelectedMaterial(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('production.mix_materials.material')} />
                    </SelectTrigger>
                    <SelectContent>
                      {rawMaterials.map((material) => (
                        <SelectItem 
                          key={material.id} 
                          value={material.id.toString()}
                          disabled={material.quantity === null || material.quantity <= 0}
                        >
                          {material.name} ({material.quantity !== null ? `${material.quantity.toFixed(2)} ${material.unit}` : t('common.out_of_stock')})
                        </SelectItem>
                      ))}
                      {rawMaterials.length === 0 && (
                        <SelectItem value="no-materials">{t('production.mix_materials.no_materials')}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('production.mix_materials.quantity')}</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder={t('production.mix_materials.quantity')}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingMaterial(false);
                      setSelectedMaterial(null);
                      setQuantity("");
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    onClick={handleAddMaterial}
                    disabled={addMixItemMutation.isPending}
                  >
                    {addMixItemMutation.isPending ? (
                      <>
                        <span className="animate-spin mr-2">◌</span>
                        {t('common.adding')}...
                      </>
                    ) : (
                      t('production.mix_materials.add_material')
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              canEdit && (
                <Button 
                  className="w-full justify-center"
                  onClick={() => setIsAddingMaterial(true)}
                >
                  <span className="material-icons mr-2">add</span>
                  {t('production.mix_materials.add_material_to_mix')}
                </Button>
              )
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('production.mix_materials.composition')}</CardTitle>
        </CardHeader>
        <CardContent>
          {itemsLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-10 bg-secondary-100 rounded"></div>
              <div className="h-10 bg-secondary-100 rounded"></div>
              <div className="h-10 bg-secondary-100 rounded"></div>
            </div>
          ) : mixItems && mixItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('production.mix_materials.material')}</TableHead>
                  <TableHead className="text-right">{t('production.mix_materials.quantity')}</TableHead>
                  <TableHead className="text-right">{t('production.mix_materials.percentage')}</TableHead>
                  <TableHead className="w-[100px] text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mixItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {getRawMaterialName(item.rawMaterialId)}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.percentage?.toFixed(2) || "0.00"}%</TableCell>
                    <TableCell className="text-right">
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive-500"
                          onClick={() => handleRemoveMaterial(item.id)}
                          disabled={removeMixItemMutation.isPending}
                        >
                          <span className="material-icons text-sm">delete</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-secondary-400">
              {t('production.mix_materials.no_materials')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden printable label section that will only show when printing */}
      <div className="hidden print:block print:m-0 print:p-0">
        {generatePrintableLabel()}
      </div>
    </div>
  );
}