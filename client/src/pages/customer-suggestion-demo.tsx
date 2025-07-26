import React, { useState } from 'react';
import { CustomerSuggestionInput } from '@/components/customer-suggestion-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Sparkles, Globe, Target } from 'lucide-react';

interface CustomerSuggestion {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  score: number;
  matchType: 'exact' | 'partial' | 'fuzzy';
}

export default function CustomerSuggestionDemo() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSuggestion | null>(null);
  const [searchHistory, setSearchHistory] = useState<CustomerSuggestion[]>([]);

  const handleCustomerSelect = (customer: CustomerSuggestion) => {
    setSelectedCustomer(customer);
    
    // Add to search history (avoid duplicates)
    setSearchHistory(prev => {
      const filtered = prev.filter(c => c.id !== customer.id);
      return [customer, ...filtered].slice(0, 5); // Keep only last 5
    });
  };

  const clearSelection = () => {
    setSelectedCustomer(null);
  };

  const examples = [
    { query: 'Price House', description: 'Try exact customer name' },
    { query: 'Price Hose', description: 'Test with typo (should find "Price House")' },
    { query: 'مركز 2000', description: 'Arabic customer name' },
    { query: 'مركز', description: 'Partial Arabic search' },
    { query: 'Safi', description: 'Partial English name' },
    { query: 'CID486', description: 'Search by customer code' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-blue-600" />
          AI-Powered Customer Search
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Intelligent customer name suggestion and correction with fuzzy search, multilingual support, and spelling error tolerance
        </p>
      </div>

      {/* Main Demo Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Smart Customer Search
            </CardTitle>
            <CardDescription>
              Start typing a customer name, code, or partial match. The AI will suggest relevant customers with intelligent matching.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CustomerSuggestionInput
              onSelect={handleCustomerSelect}
              placeholder="Type customer name or code..."
              className="text-lg py-3"
            />

            {selectedCustomer && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-green-800">Selected Customer</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="text-green-600 border-green-300 hover:bg-green-100"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">{selectedCustomer.name}</p>
                  {selectedCustomer.nameAr && (
                    <p className="text-sm text-gray-600" dir="rtl">{selectedCustomer.nameAr}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span>ID: {selectedCustomer.code}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedCustomer.matchType} match
                    </Badge>
                    <span className="text-green-600">
                      {(selectedCustomer.score * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features & Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Multilingual Support</h4>
                  <p className="text-sm text-blue-600">Search in English and Arabic with automatic language detection</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Fuzzy Matching</h4>
                  <p className="text-sm text-purple-600">Finds customers even with typos and partial names</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Search className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Smart Scoring</h4>
                  <p className="text-sm text-green-600">AI-powered relevance scoring with match type indicators</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Try These Examples:</h4>
              <div className="grid grid-cols-1 gap-2">
                {examples.map((example, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    <code className="text-blue-600 font-mono">{example.query}</code>
                    <span className="text-gray-600 ml-2">- {example.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Selections</CardTitle>
            <CardDescription>Your recently selected customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {searchHistory.map((customer) => (
                <div key={customer.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                     onClick={() => setSelectedCustomer(customer)}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{customer.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {customer.matchType}
                    </Badge>
                  </div>
                  {customer.nameAr && (
                    <p className="text-xs text-gray-600 mb-1" dir="rtl">{customer.nameAr}</p>
                  )}
                  <p className="text-xs text-gray-500">{customer.code}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}