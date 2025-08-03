import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  GitBranch,
  GitCommit,
  History,
  Tag,
  GitCompare,
  RotateCcw,
  Plus,
  Eye,
  Check,
  X,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";

interface VersionControlPanelProps {
  documentId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function VersionControlPanel({ documentId, isOpen, onClose }: VersionControlPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [compareFromVersion, setCompareFromVersion] = useState<number | null>(null);
  const [compareToVersion, setCompareToVersion] = useState<number | null>(null);

  // Fetch document versions
  const { data: versions = [], isLoading: versionsLoading } = useQuery({
    queryKey: [`/api/documents/${documentId}/versions`],
    enabled: isOpen && !!documentId,
  });

  // Fetch version statistics
  const { data: stats } = useQuery({
    queryKey: [`/api/documents/${documentId}/stats`],
    enabled: isOpen && !!documentId,
  });

  // Fetch version comparisons
  const { data: comparisons = [] } = useQuery({
    queryKey: [`/api/documents/${documentId}/comparisons`],
    enabled: isOpen && !!documentId,
  });

  // Create new version mutation
  const createVersionMutation = useMutation({
    mutationFn: async (versionData: any) => {
      return apiRequest(`/api/documents/${documentId}/versions`, {
        method: "POST",
        body: JSON.stringify(versionData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/versions`] });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/stats`] });
      toast({ title: "Version created successfully" });
    },
  });

  // Activate version mutation
  const activateVersionMutation = useMutation({
    mutationFn: async (versionId: number) => {
      return apiRequest(`/api/documents/${documentId}/versions/${versionId}/activate`, {
        method: "PUT",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/versions`] });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}`] });
      toast({ title: "Version activated successfully" });
    },
  });

  // Compare versions mutation
  const compareVersionsMutation = useMutation({
    mutationFn: async ({ fromId, toId }: { fromId: number; toId: number }) => {
      return apiRequest(`/api/versions/${fromId}/compare/${toId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/comparisons`] });
      toast({ title: "Version comparison completed" });
    },
  });

  // Rollback version mutation
  const rollbackVersionMutation = useMutation({
    mutationFn: async (targetVersionId: number) => {
      return apiRequest(`/api/documents/${documentId}/rollback/${targetVersionId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}/versions`] });
      queryClient.invalidateQueries({ queryKey: [`/api/documents/${documentId}`] });
      toast({ title: "Version rollback completed successfully" });
    },
  });

  const handleCreateVersion = (versionData: any) => {
    createVersionMutation.mutate(versionData);
  };

  const handleActivateVersion = (versionId: number) => {
    activateVersionMutation.mutate(versionId);
  };

  const handleCompareVersions = () => {
    if (compareFromVersion && compareToVersion) {
      compareVersionsMutation.mutate({
        fromId: compareFromVersion,
        toId: compareToVersion,
      });
    }
  };

  const handleRollback = (targetVersionId: number) => {
    rollbackVersionMutation.mutate(targetVersionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500";
      case "draft": return "bg-yellow-500";
      case "under_review": return "bg-blue-500";
      case "archived": return "bg-gray-500";
      default: return "bg-gray-400";
    }
  };

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case "major": return "bg-red-500";
      case "minor": return "bg-blue-500";
      case "patch": return "bg-green-500";
      case "hotfix": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Document Version Control
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="versions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="versions">Versions</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="versions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Document Versions</h3>
              <CreateVersionDialog onCreateVersion={handleCreateVersion} />
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-3">
                {versions.map((version: any) => (
                  <Card key={version.id} className={`${version.isActive ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(version.status)}>
                              {version.status}
                            </Badge>
                            <Badge variant="outline" className={getChangeTypeColor(version.changeType)}>
                              {version.changeType}
                            </Badge>
                            <span className="font-mono text-sm">{version.versionNumber}</span>
                            {version.isActive && (
                              <Badge variant="default">Active</Badge>
                            )}
                          </div>
                          <h4 className="font-medium">{version.title}</h4>
                          {version.summary && (
                            <p className="text-sm text-muted-foreground">{version.summary}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {version.createdBy}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(version.createdAt), 'PPp')}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {version.wordCount} words
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVersion(version.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!version.isActive && (
                            <Button
                              size="sm"
                              onClick={() => handleActivateVersion(version.id)}
                              disabled={activateVersionMutation.isPending}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRollback(version.id)}
                            disabled={rollbackVersionMutation.isPending}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="compare" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Version</Label>
                <Select onValueChange={(value) => setCompareFromVersion(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version: any) => (
                      <SelectItem key={version.id} value={version.id.toString()}>
                        {version.versionNumber} - {version.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To Version</Label>
                <Select onValueChange={(value) => setCompareToVersion(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map((version: any) => (
                      <SelectItem key={version.id} value={version.id.toString()}>
                        {version.versionNumber} - {version.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleCompareVersions}
              disabled={!compareFromVersion || !compareToVersion || compareVersionsMutation.isPending}
              className="w-full"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Compare Versions
            </Button>

            <ScrollArea className="h-80">
              <div className="space-y-3">
                {comparisons.map((comparison: any) => (
                  <Card key={comparison.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Comparison Results</h4>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comparison.createdAt), 'PPp')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600">+{comparison.additionsCount} additions</span>
                          <span className="text-red-600">-{comparison.deletionsCount} deletions</span>
                          <span className="text-blue-600">~{comparison.modificationsCount} modifications</span>
                        </div>
                        {comparison.addedContent && (
                          <div className="bg-green-50 p-2 rounded text-sm">
                            <strong>Added:</strong> {comparison.addedContent.substring(0, 200)}...
                          </div>
                        )}
                        {comparison.removedContent && (
                          <div className="bg-red-50 p-2 rounded text-sm">
                            <strong>Removed:</strong> {comparison.removedContent.substring(0, 200)}...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <h3 className="text-lg font-semibold">Version History</h3>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {versions.map((version: any, index: number) => (
                  <div key={version.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0">
                      <GitCommit className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{version.versionNumber}</span>
                        <Badge size="sm" className={getChangeTypeColor(version.changeType)}>
                          {version.changeType}
                        </Badge>
                      </div>
                      <p className="text-sm">{version.summary || 'No summary provided'}</p>
                      <p className="text-xs text-muted-foreground">
                        {version.createdBy} • {format(new Date(version.createdAt), 'PPp')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <h3 className="text-lg font-semibold">Version Statistics</h3>
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{stats.totalVersions}</div>
                    <p className="text-sm text-muted-foreground">Total Versions</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{stats.publishedVersions}</div>
                    <p className="text-sm text-muted-foreground">Published</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{stats.draftVersions}</div>
                    <p className="text-sm text-muted-foreground">Drafts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{stats.majorVersions}</div>
                    <p className="text-sm text-muted-foreground">Major Versions</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function CreateVersionDialog({ onCreateVersion }: { onCreateVersion: (data: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    changeType: 'minor',
    changeLog: '',
    majorVersion: 1,
    minorVersion: 0,
    patchVersion: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateVersion(formData);
    setIsOpen(false);
    setFormData({
      title: '',
      content: '',
      summary: '',
      changeType: 'minor',
      changeLog: '',
      majorVersion: 1,
      minorVersion: 0,
      patchVersion: 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Version
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Input
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="changeType">Change Type</Label>
            <Select value={formData.changeType} onValueChange={(value) => setFormData({ ...formData, changeType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="major">Major</SelectItem>
                <SelectItem value="minor">Minor</SelectItem>
                <SelectItem value="patch">Patch</SelectItem>
                <SelectItem value="hotfix">Hotfix</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="majorVersion">Major</Label>
              <Input
                id="majorVersion"
                type="number"
                min="1"
                value={formData.majorVersion}
                onChange={(e) => setFormData({ ...formData, majorVersion: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="minorVersion">Minor</Label>
              <Input
                id="minorVersion"
                type="number"
                min="0"
                value={formData.minorVersion}
                onChange={(e) => setFormData({ ...formData, minorVersion: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="patchVersion">Patch</Label>
              <Input
                id="patchVersion"
                type="number"
                min="0"
                value={formData.patchVersion}
                onChange={(e) => setFormData({ ...formData, patchVersion: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="changeLog">Change Log</Label>
            <Textarea
              id="changeLog"
              value={formData.changeLog}
              onChange={(e) => setFormData({ ...formData, changeLog: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Version</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}