import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, Printer, Download, Trash2, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';

// Simple date formatting function
const formatDate = (date: Date | string, formatStr: string = 'dd/MM/yyyy') => {
  const d = new Date(date);
  if (formatStr === 'dd/MM/yyyy') {
    return d.toLocaleDateString('en-GB');
  } else if (formatStr === 'dd/MM/yyyy HH:mm') {
    return d.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  } else if (formatStr === 'yyyy-MM-dd_HHmm') {
    return d.toISOString().slice(0, 16).replace('T', '_').replace(':', '');
  }
  return d.toLocaleDateString();
};

interface CustomerInformation {
  id: number;
  commercialNameAr?: string;
  commercialNameEn?: string;
  commercialRegistrationNo?: string;
  unifiedNo?: string;
  vatNo?: string;
  province: string;
  city?: string;
  neighborName?: string;
  buildingNo?: string;
  additionalNo?: string;
  postalCode?: string;
  responseName?: string;
  responseNo?: string;
  createdAt: string;
}

export default function CustomerInfoReport() {
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customer information records
  const { data: customerInfos = [], isLoading } = useQuery<CustomerInformation[]>({
    queryKey: ['/api/customer-information']
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/customer-information/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete customer information');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customer-information'] });
      toast({
        title: "Success",
        description: "Customer information deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter customer information records
  const filteredRecords = customerInfos.filter((record) => {
    const matchesSearch = 
      record.commercialNameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.commercialNameEn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.commercialRegistrationNo?.includes(searchTerm) ||
      record.unifiedNo?.includes(searchTerm) ||
      record.vatNo?.includes(searchTerm);

    const matchesProvince = provinceFilter === "all" || record.province === provinceFilter;

    return matchesSearch && matchesProvince;
  });

  // Handle record selection
  const handleSelectRecord = (id: number) => {
    setSelectedRecords(prev => 
      prev.includes(id) 
        ? prev.filter(recordId => recordId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map(record => record.id));
    }
  };

  // Print function
  const handlePrint = (records: CustomerInformation[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Customer Information Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-logo { max-width: 150px; height: auto; margin-bottom: 10px; }
            .company-name { font-size: 24px; font-weight: bold; color: #065f46; margin-bottom: 5px; }
            .company-name-ar { font-size: 20px; color: #059669; margin-bottom: 20px; }
            .report-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .report-info { font-size: 12px; color: #666; margin-bottom: 20px; }
            .record { border: 2px solid #059669; margin-bottom: 20px; page-break-inside: avoid; }
            .record-header { background: linear-gradient(135deg, #065f46, #059669); color: white; padding: 10px; }
            .record-content { padding: 15px; }
            .field-row { display: flex; margin-bottom: 8px; }
            .field-label { font-weight: bold; width: 180px; color: #065f46; }
            .field-value { flex: 1; }
            .section-title { font-size: 14px; font-weight: bold; color: #065f46; margin: 15px 0 10px 0; border-bottom: 1px solid #059669; padding-bottom: 5px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            @media print { body { margin: 0; } .header { margin-bottom: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/assets/company-logo.png" alt="Company Logo" class="company-logo" />
            <div class="company-name">Modern Plastic Bag Factory</div>
            <div class="company-name-ar">مصنع أكياس البلاستيك الحديث</div>
            <div class="report-title">Customer Information Report</div>
            <div class="report-info">
              Generated on: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm')} | Total Records: ${records.length}
            </div>
          </div>
          
          ${records.map(record => `
            <div class="record">
              <div class="record-header">
                <strong>Customer ID: ${record.id}</strong> | Registered: ${formatDate(new Date(record.createdAt), 'dd/MM/yyyy')}
              </div>
              <div class="record-content">
                <div class="section-title">Commercial Names</div>
                ${record.commercialNameAr ? `<div class="field-row"><span class="field-label">Arabic Name:</span><span class="field-value">${record.commercialNameAr}</span></div>` : ''}
                ${record.commercialNameEn ? `<div class="field-row"><span class="field-label">English Name:</span><span class="field-value">${record.commercialNameEn}</span></div>` : ''}
                
                <div class="section-title">Registration Information</div>
                ${record.commercialRegistrationNo ? `<div class="field-row"><span class="field-label">Commercial Registration:</span><span class="field-value">${record.commercialRegistrationNo}</span></div>` : ''}
                ${record.unifiedNo ? `<div class="field-row"><span class="field-label">Unified Number:</span><span class="field-value">${record.unifiedNo}</span></div>` : ''}
                ${record.vatNo ? `<div class="field-row"><span class="field-label">VAT Number:</span><span class="field-value">${record.vatNo}</span></div>` : ''}
                
                <div class="section-title">Address Information</div>
                <div class="field-row"><span class="field-label">Province:</span><span class="field-value">${record.province}</span></div>
                ${record.city ? `<div class="field-row"><span class="field-label">City:</span><span class="field-value">${record.city}</span></div>` : ''}
                ${record.neighborName ? `<div class="field-row"><span class="field-label">Neighborhood:</span><span class="field-value">${record.neighborName}</span></div>` : ''}
                ${record.buildingNo ? `<div class="field-row"><span class="field-label">Building Number:</span><span class="field-value">${record.buildingNo}</span></div>` : ''}
                ${record.additionalNo ? `<div class="field-row"><span class="field-label">Additional Number:</span><span class="field-value">${record.additionalNo}</span></div>` : ''}
                ${record.postalCode ? `<div class="field-row"><span class="field-label">Postal Code:</span><span class="field-value">${record.postalCode}</span></div>` : ''}
                
                ${record.responseName || record.responseNo ? `
                <div class="section-title">Contact Information</div>
                ${record.responseName ? `<div class="field-row"><span class="field-label">Contact Name:</span><span class="field-value">${record.responseName}</span></div>` : ''}
                ${record.responseNo ? `<div class="field-row"><span class="field-label">Contact Number:</span><span class="field-value">${record.responseNo}</span></div>` : ''}
                ` : ''}
              </div>
            </div>
          `).join('')}
          
          <div class="footer">
            <p>Modern Plastic Bag Factory - Customer Information Report</p>
            <p>This report contains ${records.length} customer registration record${records.length !== 1 ? 's' : ''}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Export to Excel function
  const handleExportExcel = (records: CustomerInformation[]) => {
    const exportData = records.map(record => ({
      'ID': record.id,
      'Arabic Commercial Name': record.commercialNameAr || '',
      'English Commercial Name': record.commercialNameEn || '',
      'Commercial Registration No': record.commercialRegistrationNo || '',
      'Unified No': record.unifiedNo || '',
      'VAT No': record.vatNo || '',
      'Province': record.province,
      'City': record.city || '',
      'Neighborhood': record.neighborName || '',
      'Building No': record.buildingNo || '',
      'Additional No': record.additionalNo || '',
      'Postal Code': record.postalCode || '',
      'Contact Name': record.responseName || '',
      'Contact Number': record.responseNo || '',
      'Registration Date': formatDate(new Date(record.createdAt), 'dd/MM/yyyy HH:mm')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer Information');
    
    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    worksheet['!cols'] = colWidths;

    const fileName = `Customer_Information_Report_${formatDate(new Date(), 'yyyy-MM-dd_HHmm')}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Export Successful",
      description: `Excel file "${fileName}" has been downloaded`,
    });
  };

  // Get unique provinces for filter
  const provinces = Array.from(new Set(customerInfos.map(record => record.province))).filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">
            Customer Information Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, registration no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="province">Province</Label>
              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Provinces</SelectItem>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={() => handlePrint(selectedRecords.length > 0 
                  ? filteredRecords.filter(r => selectedRecords.includes(r.id))
                  : filteredRecords
                )}
                className="bg-green-600 hover:bg-green-700"
                disabled={filteredRecords.length === 0}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print {selectedRecords.length > 0 ? `(${selectedRecords.length})` : 'All'}
              </Button>
              <Button
                onClick={() => handleExportExcel(selectedRecords.length > 0 
                  ? filteredRecords.filter(r => selectedRecords.includes(r.id))
                  : filteredRecords
                )}
                variant="outline"
                disabled={filteredRecords.length === 0}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              Showing {filteredRecords.length} of {customerInfos.length} customer records
              {selectedRecords.length > 0 && (
                <span className="ml-2 font-semibold">
                  • {selectedRecords.length} selected
                </span>
              )}
            </p>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Commercial Names</TableHead>
                  <TableHead>Registration Info</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No customer information records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => handleSelectRecord(record.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">#{record.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {record.commercialNameAr && (
                            <div className="text-sm">{record.commercialNameAr}</div>
                          )}
                          {record.commercialNameEn && (
                            <div className="text-sm text-gray-600">{record.commercialNameEn}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {record.commercialRegistrationNo && (
                            <div>CR: {record.commercialRegistrationNo}</div>
                          )}
                          {record.unifiedNo && (
                            <div>UN: {record.unifiedNo}</div>
                          )}
                          {record.vatNo && (
                            <div>VAT: {record.vatNo}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{record.province}</div>
                          {record.city && <div className="text-gray-600">{record.city}</div>}
                          {record.neighborName && <div className="text-gray-500">{record.neighborName}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {record.responseName && <div>{record.responseName}</div>}
                          {record.responseNo && <div className="text-gray-600">{record.responseNo}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(new Date(record.createdAt), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* View Dialog */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Customer Information Details</DialogTitle>
                                <DialogDescription>
                                  Complete information for customer record #{record.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-green-700 mb-2">Commercial Names</h4>
                                    {record.commercialNameAr && <p><strong>Arabic:</strong> {record.commercialNameAr}</p>}
                                    {record.commercialNameEn && <p><strong>English:</strong> {record.commercialNameEn}</p>}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-green-700 mb-2">Registration Info</h4>
                                    {record.commercialRegistrationNo && <p><strong>Commercial Reg:</strong> {record.commercialRegistrationNo}</p>}
                                    {record.unifiedNo && <p><strong>Unified No:</strong> {record.unifiedNo}</p>}
                                    {record.vatNo && <p><strong>VAT No:</strong> {record.vatNo}</p>}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-green-700 mb-2">Address Information</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p><strong>Province:</strong> {record.province}</p>
                                      {record.city && <p><strong>City:</strong> {record.city}</p>}
                                      {record.neighborName && <p><strong>Neighborhood:</strong> {record.neighborName}</p>}
                                    </div>
                                    <div>
                                      {record.buildingNo && <p><strong>Building No:</strong> {record.buildingNo}</p>}
                                      {record.additionalNo && <p><strong>Additional No:</strong> {record.additionalNo}</p>}
                                      {record.postalCode && <p><strong>Postal Code:</strong> {record.postalCode}</p>}
                                    </div>
                                  </div>
                                </div>
                                {(record.responseName || record.responseNo) && (
                                  <div>
                                    <h4 className="font-semibold text-green-700 mb-2">Contact Information</h4>
                                    {record.responseName && <p><strong>Contact Name:</strong> {record.responseName}</p>}
                                    {record.responseNo && <p><strong>Contact Number:</strong> {record.responseNo}</p>}
                                  </div>
                                )}
                                <div>
                                  <p><strong>Registration Date:</strong> {formatDate(new Date(record.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {/* Print Single */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrint([record])}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>

                          {/* Delete */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Customer Information</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this customer information record? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(record.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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