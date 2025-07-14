import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/use-language";
import GeofenceMap from "@/components/hr/geofence-map";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Map,
  CheckCircle,
  AlertCircle,
  Eye,
  Navigation,
  MoreHorizontal,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const geofenceSchema = z.object({
  name: z.string().min(1, "Geofence name is required"),
  centerLatitude: z.number().min(-90).max(90),
  centerLongitude: z.number().min(-180).max(180),
  radius: z
    .number()
    .min(10, "Minimum radius is 10 meters")
    .max(1000, "Maximum radius is 1000 meters"),
  sectionIds: z.array(z.string()).optional(),
  geofenceType: z.string().default("factory"),
  description: z.string().optional(),
});

type GeofenceForm = z.infer<typeof geofenceSchema>;

export default function GeofenceManagement() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  const [selectedGeofence, setSelectedGeofence] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewGeofence, setViewGeofence] = useState<any>(null);

  // Fetch geofences
  const { data: geofences = [], isLoading } = useQuery({
    queryKey: ["/api/hr/geofences"],
    queryFn: () => apiRequest("GET", "/api/hr/geofences"),
  });

  // Fetch sections for dropdown
  const { data: sections = [] } = useQuery({
    queryKey: ["/api/sections"],
    queryFn: () => apiRequest("GET", "/api/sections"),
  });

  // Form setup
  const form = useForm<GeofenceForm>({
    resolver: zodResolver(geofenceSchema),
    defaultValues: {
      radius: 100,
      sectionIds: [],
      centerLatitude: 26.4011776, // Default to Bahrain coordinates
      centerLongitude: 50.069504,
      geofenceType: "factory",
    },
  });

  // Create geofence mutation
  const createGeofenceMutation = useMutation({
    mutationFn: (data: GeofenceForm) =>
      apiRequest("POST", "/api/hr/geofences", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/geofences"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Geofence created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create geofence",
        variant: "destructive",
      });
    },
  });

  // Update geofence mutation
  const updateGeofenceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GeofenceForm }) =>
      apiRequest("PUT", `/api/hr/geofences/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/geofences"] });
      setIsDialogOpen(false);
      setSelectedGeofence(null);
      form.reset();
      toast({
        title: "Success",
        description: "Geofence updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update geofence",
        variant: "destructive",
      });
    },
  });

  // Delete geofence mutation
  const deleteGeofenceMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/hr/geofences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/geofences"] });
      toast({
        title: "Success",
        description: "Geofence deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete geofence",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: GeofenceForm) => {
    if (selectedGeofence) {
      updateGeofenceMutation.mutate({ id: selectedGeofence.id, data });
    } else {
      createGeofenceMutation.mutate(data);
    }
  };

  const handleEdit = (geofence: any) => {
    setSelectedGeofence(geofence);
    form.reset({
      name: geofence.name,
      centerLatitude: geofence.centerLatitude,
      centerLongitude: geofence.centerLongitude,
      radius: geofence.radius,
      sectionIds: geofence.sectionIds || [],
      geofenceType: geofence.geofenceType || "factory",
      description: geofence.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleView = (geofence: any) => {
    setViewGeofence(geofence);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteGeofenceMutation.mutate(id);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("centerLatitude", position.coords.latitude);
          form.setValue("centerLongitude", position.coords.longitude);
          toast({
            title: "Location Set",
            description: "Current location has been set as geofence center",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description:
              "Could not get current location. Please enter coordinates manually.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("hr.geofence_management.title")}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {t("hr.geofence_management.description")}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedGeofence(null);
                form.reset();
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Geofence
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedGeofence ? "Edit Geofence" : "Create New Geofence"}
              </DialogTitle>
              <DialogDescription>
                {selectedGeofence
                  ? "Modify the selected geofence settings and location parameters"
                  : "Set up a new geographical boundary for location-based attendance tracking"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Geofence Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Factory Main Building" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="geofenceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="factory" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Brief description of this geofence..." />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Google Maps Integration */}
                <div className="space-y-4">
                  <Label>Location Selection</Label>
                  <GeofenceMap
                    latitude={form.watch("centerLatitude") || 26.4011776}
                    longitude={form.watch("centerLongitude") || 50.069504}
                    radius={form.watch("radius") || 100}
                    onLocationSelect={(lat: number, lng: number) => {
                      form.setValue("centerLatitude", lat);
                      form.setValue("centerLongitude", lng);
                    }}
                    onRadiusChange={(radius: number) => {
                      form.setValue("radius", radius);
                    }}
                    height="450px"
                    interactive={true}
                    showCurrentLocation={true}
                    existingGeofences={geofences.filter(g => !selectedGeofence || g.id !== selectedGeofence.id)}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="centerLatitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder="26.4011776"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="centerLongitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.000001"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                            placeholder="50.069504"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="radius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Radius (meters)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="10"
                            max="1000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 100)
                            }
                            placeholder="100"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGetCurrentLocation}
                    className="w-full"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Use My Current Location
                  </Button>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedGeofence(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createGeofenceMutation.isPending ||
                      updateGeofenceMutation.isPending
                    }
                  >
                    {createGeofenceMutation.isPending ||
                    updateGeofenceMutation.isPending
                      ? "Saving..."
                      : selectedGeofence ? "Update Geofence" : "Create Geofence"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Geofences
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {geofences.length}
                </p>
              </div>
              <Map className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Geofences
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {geofences.filter((g: any) => g.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Radius</p>
                <p className="text-3xl font-bold text-gray-900">
                  {geofences.length > 0
                    ? Math.round(
                        geofences.reduce(
                          (sum: number, g: any) => sum + g.radius,
                          0,
                        ) / geofences.length,
                      )
                    : 0}
                  m
                </p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geofences Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Configured Geofences ({geofences.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading geofences...</div>
          ) : geofences.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No geofences configured. Create your first geofence to enable
              automatic attendance tracking.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Center Coordinates</TableHead>
                    <TableHead>Radius</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Coverage Area</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {geofences.map((geofence: any) => (
                    <TableRow key={geofence.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{geofence.name}</div>
                          <div className="text-sm text-gray-500">
                            ID: {geofence.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Lat: {geofence.centerLatitude.toFixed(6)}</div>
                          <div>Lng: {geofence.centerLongitude.toFixed(6)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{geofence.radius}m</div>
                        <div className="text-sm text-gray-500">
                          {(
                            (Math.PI * Math.pow(geofence.radius, 2)) /
                            1000000
                          ).toFixed(3)} km²
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={geofence.isActive ? "default" : "secondary"}
                          className={geofence.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {geofence.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {(
                              (Math.PI * Math.pow(geofence.radius, 2)) /
                              1000000
                            ).toFixed(3)} km²
                          </div>
                          <div className="text-gray-500">
                            Coverage Area
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleView(geofence)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEdit(geofence)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    geofence "{geofence.name}" and remove all associated location
                                    validation rules.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(geofence.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Geofence Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Geofence Details: {viewGeofence?.name}
            </DialogTitle>
            <DialogDescription>
              Complete information and location map for this geofence
            </DialogDescription>
          </DialogHeader>

          {viewGeofence && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Name</Label>
                      <p className="text-lg font-semibold">{viewGeofence.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Type</Label>
                      <p className="text-sm">{viewGeofence.geofenceType || "factory"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <Badge
                        variant={viewGeofence.isActive ? "default" : "secondary"}
                        className={viewGeofence.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {viewGeofence.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {viewGeofence.description && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Description</Label>
                        <p className="text-sm">{viewGeofence.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Location Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Center Coordinates</Label>
                      <p className="text-sm font-mono">
                        {viewGeofence.centerLatitude.toFixed(6)}, {viewGeofence.centerLongitude.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Radius</Label>
                      <p className="text-lg font-semibold">{viewGeofence.radius} meters</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Coverage Area</Label>
                      <p className="text-lg font-semibold">
                        {((Math.PI * Math.pow(viewGeofence.radius, 2)) / 1000000).toFixed(3)} km²
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Created</Label>
                      <p className="text-sm">
                        {new Date(viewGeofence.createdAt).toLocaleDateString()} at{" "}
                        {new Date(viewGeofence.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Location Map */}
              <GeofenceMap
                latitude={viewGeofence.centerLatitude}
                longitude={viewGeofence.centerLongitude}
                radius={viewGeofence.radius}
                onLocationSelect={() => {}} // Not interactive in view mode
                height="400px"
                interactive={false}
                showCurrentLocation={true}
                existingGeofences={geofences.filter(g => g.id !== viewGeofence.id)}
              />

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEdit(viewGeofence);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Geofence
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Information Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            How Geofencing Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Automatic Check-in</h4>
              <p className="text-sm text-gray-600">
                Employees can only check in when they are within the configured
                geofence area. This ensures accurate location-based attendance
                tracking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Automatic Check-out</h4>
              <p className="text-sm text-gray-600">
                When an employee leaves the geofenced area while still checked
                in, the system automatically checks them out to prevent time
                fraud.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Security Benefits</h4>
              <p className="text-sm text-gray-600">
                Geofencing prevents remote clock-ins and ensures employees are
                physically present at the workplace during their recorded
                working hours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Best Practices</h4>
              <p className="text-sm text-gray-600">
                Set the radius large enough to cover parking areas and building
                entrances, but small enough to maintain security and accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}