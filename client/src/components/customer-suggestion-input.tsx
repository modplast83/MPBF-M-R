import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Check, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface CustomerSuggestion {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  score: number;
  matchType: 'exact' | 'partial' | 'fuzzy';
}

interface CustomerSuggestionInputProps {
  value?: string;
  onSelect: (customer: CustomerSuggestion) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
}

export function CustomerSuggestionInput({
  value = '',
  onSelect,
  placeholder = "Start typing customer name...",
  className,
  showSuggestions = true
}: CustomerSuggestionInputProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Debounced search query
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch customer suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['/api/customers/suggestions', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        return { suggestions: [] };
      }

      const response = await fetch(
        `/api/customers/suggestions?query=${encodeURIComponent(debouncedQuery)}&limit=6`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      
      return response.json();
    },
    enabled: debouncedQuery.length >= 2 && showSuggestions
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setIsOpen(newValue.length >= 2);
    setSelectedIndex(-1);
  }, []);

  const handleSelectCustomer = useCallback((customer: CustomerSuggestion) => {
    setQuery(customer.name);
    setIsOpen(false);
    onSelect(customer);
  }, [onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!suggestions?.suggestions || suggestions.suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.suggestions.length) {
          handleSelectCustomer(suggestions.suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [suggestions, selectedIndex, handleSelectCustomer]);

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fuzzy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMatchTypeIcon = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return <Check className="w-3 h-3" />;
      case 'partial':
        return <Search className="w-3 h-3" />;
      case 'fuzzy':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(query.length >= 2)}
          placeholder={placeholder}
          className={cn("pr-10", className)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && showSuggestions && suggestions?.suggestions && suggestions.suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0 max-h-80 overflow-y-auto">
            {suggestions.suggestions.map((customer, index) => (
              <div
                key={customer.id}
                className={cn(
                  "px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors",
                  selectedIndex === index && "bg-blue-50"
                )}
                onClick={() => handleSelectCustomer(customer)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {customer.name}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs px-1.5 py-0.5 flex items-center gap-1", getMatchTypeColor(customer.matchType))}
                      >
                        {getMatchTypeIcon(customer.matchType)}
                        {customer.matchType}
                      </Badge>
                    </div>
                    {customer.nameAr && (
                      <p className="text-xs text-gray-600 mb-1 truncate" dir="rtl">
                        {customer.nameAr}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-500">
                        ID: {customer.code}
                      </p>
                      <p className="text-xs text-gray-400">
                        Score: {(customer.score * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isOpen && showSuggestions && debouncedQuery.length >= 2 && 
       suggestions?.suggestions && suggestions.suggestions.length === 0 && !isLoading && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">No customers found for "{debouncedQuery}"</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Try different spelling or partial name
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}