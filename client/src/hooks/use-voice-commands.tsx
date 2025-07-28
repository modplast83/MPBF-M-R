import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { voiceCommandProcessor, VoiceCommandResult } from '@/utils/voice-commands';

interface VoiceCommandHookResult {
  executeVoiceCommand: (commandResult: VoiceCommandResult) => Promise<void>;
  isExecuting: boolean;
  lastExecutedCommand: VoiceCommandResult | null;
}

export function useVoiceCommands(): VoiceCommandHookResult {
  const { toast } = useToast();
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecutedCommand, setLastExecutedCommand] = useState<VoiceCommandResult | null>(null);
  
  // Navigation mutation
  const navigationMutation = useMutation({
    mutationFn: async (url: string) => {
      window.location.href = url;
      return { success: true };
    }
  });

  // Data query mutation
  const dataQueryMutation = useMutation({
    mutationFn: async (queryType: string) => {
      const response = await fetch(`/api/ai/voice-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryType, timestamp: Date.now() })
      });
      
      if (!response.ok) throw new Error('Failed to execute data query');
      return response.json();
    }
  });

  // Record creation mutation
  const createRecordMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string; data: any }) => {
      const response = await fetch(`/api/ai/voice-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordType: type, recordData: data, timestamp: Date.now() })
      });
      
      if (!response.ok) throw new Error('Failed to create record');
      return response.json();
    }
  });

  // Record update mutation
  const updateRecordMutation = useMutation({
    mutationFn: async ({ type, id, updates }: { type: string; id: string; updates: any }) => {
      const response = await fetch(`/api/ai/voice-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordType: type, recordId: id, updates, timestamp: Date.now() })
      });
      
      if (!response.ok) throw new Error('Failed to update record');
      return response.json();
    }
  });

  const executeVoiceCommand = useCallback(async (commandResult: VoiceCommandResult) => {
    setIsExecuting(true);
    setLastExecutedCommand(commandResult);
    
    try {
      const { command, extractedParams } = commandResult;
      
      switch (command.action) {
        case 'navigate':
          await navigationMutation.mutateAsync(command.parameters?.url);
          toast({
            title: "Navigation",
            description: `Navigating to ${command.parameters?.url}`,
          });
          break;

        case 'query_data':
          const queryResult = await dataQueryMutation.mutateAsync(command.parameters?.type);
          toast({
            title: "Data Query",
            description: `Retrieved ${command.parameters?.type} data`,
          });
          return queryResult;

        case 'create_record':
          const createData = {
            name: extractedParams.extracted || 'New Record',
            ...extractedParams
          };
          
          const createResult = await createRecordMutation.mutateAsync({
            type: command.parameters?.type,
            data: createData
          });
          
          toast({
            title: "Record Created",
            description: `Successfully created ${command.parameters?.type}`,
          });
          return createResult;

        case 'update_record':
          if (!extractedParams.extracted) {
            throw new Error('Record identifier required for update');
          }
          
          const updateResult = await updateRecordMutation.mutateAsync({
            type: command.parameters?.type,
            id: extractedParams.extracted,
            updates: { status: command.parameters?.status }
          });
          
          toast({
            title: "Record Updated",
            description: `Successfully updated ${command.parameters?.type}`,
          });
          return updateResult;

        case 'show_help':
          const helpText = voiceCommandProcessor.getCommandHelp();
          toast({
            title: "Voice Commands Help",
            description: "Available commands displayed in console",
          });
          console.log(helpText);
          break;

        case 'change_language':
          // Language change is handled by the parent component
          toast({
            title: "Language Change",
            description: "Language switching requested",
          });
          break;

        default:
          throw new Error(`Unknown command action: ${command.action}`);
      }
    } catch (error) {
      console.error('Voice command execution error:', error);
      toast({
        title: "Command Failed",
        description: error instanceof Error ? error.message : "Failed to execute voice command",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  }, [toast, navigationMutation, dataQueryMutation, createRecordMutation, updateRecordMutation]);

  return {
    executeVoiceCommand,
    isExecuting,
    lastExecutedCommand
  };
}