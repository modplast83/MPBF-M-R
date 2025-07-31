import React from 'react';
import { 
  FadeInView, 
  ParallaxScroll, 
  HoverCard, 
  ProgressiveReveal,
  ScaleOnScroll,
  RotateOnScroll,
  SlidingText,
  CountUp
} from '@/components/ui/enhanced-animations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const AnimationDemo = () => {
  return (
    <div className="min-h-screen space-y-16 py-8">
      {/* Header with sliding text */}
      <FadeInView className="text-center space-y-4">
        <SlidingText 
          text="Smooth Page Transitions & Parallax Effects" 
          className="text-4xl font-bold text-slate-800"
        />
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Experience the enhanced user interface with subtle animations and smooth transitions
        </p>
      </FadeInView>

      {/* Statistics with count-up animation */}
      <FadeInView delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "Active Orders", value: 245, suffix: "", color: "bg-blue-500" },
            { label: "Production Lines", value: 12, suffix: "", color: "bg-green-500" },
            { label: "Quality Score", value: 98, suffix: "%", color: "bg-purple-500" },
            { label: "Efficiency", value: 94, suffix: "%", color: "bg-orange-500" }
          ].map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className={`w-16 h-16 rounded-full ${stat.color} mx-auto mb-4 flex items-center justify-center`}>
                  <CountUp 
                    end={stat.value} 
                    duration={2}
                    delay={index * 0.2}
                    suffix={stat.suffix}
                    className="text-white font-bold text-xl"
                  />
                </div>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </FadeInView>

      {/* Progressive reveal cards */}
      <div className="space-y-8">
        <SlidingText 
          text="Production Management Features" 
          className="text-2xl font-semibold text-slate-800 text-center"
          delay={0.5}
        />
        
        <ProgressiveReveal staggerDelay={0.15}>
          {[
            {
              title: "Order Management",
              description: "Streamlined order processing with real-time tracking",
              badge: "Essential",
              color: "bg-blue-50 border-blue-200"
            },
            {
              title: "Quality Control",
              description: "Comprehensive quality assurance and testing protocols",
              badge: "Critical",
              color: "bg-green-50 border-green-200"
            },
            {
              title: "Production Analytics",
              description: "Advanced analytics and performance monitoring",
              badge: "Advanced",
              color: "bg-purple-50 border-purple-200"
            },
            {
              title: "AI Assistant",
              description: "Intelligent assistance with voice commands and automation",
              badge: "Innovation",
              color: "bg-orange-50 border-orange-200"
            }
          ].map((feature, index) => (
            <HoverCard key={index} hoverScale={1.02} className="w-full">
              <Card className={`${feature.color} hover:shadow-lg transition-shadow duration-300`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-slate-800">{feature.title}</CardTitle>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </HoverCard>
          ))}
        </ProgressiveReveal>
      </div>

      {/* Parallax section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden">
        <ParallaxScroll speed={0.3} className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Parallax Background Effect</h2>
            <p className="text-xl opacity-90">This section moves at a different speed as you scroll</p>
          </div>
        </ParallaxScroll>
        <ParallaxScroll speed={0.6} className="absolute bottom-0 left-0 right-0">
          <div className="h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        </ParallaxScroll>
      </div>

      {/* Scale on scroll demo */}
      <ScaleOnScroll scaleFactor={0.15}>
        <Card className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Scale Animation</h3>
            <p className="text-slate-600">This card scales up and down as you scroll past it</p>
          </div>
        </Card>
      </ScaleOnScroll>

      {/* Rotate on scroll demo */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-8">Rotate Animation</h3>
        <RotateOnScroll rotationDegrees={360} className="inline-block">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            360°
          </div>
        </RotateOnScroll>
        <p className="text-slate-600 mt-4">This element rotates as you scroll</p>
      </div>

      {/* Multiple fade-in elements */}
      <div className="space-y-8">
        <SlidingText 
          text="Directional Fade-In Effects" 
          className="text-2xl font-semibold text-slate-800 text-center"
          delay={0.8}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { direction: 'up', label: 'Fade Up' },
            { direction: 'down', label: 'Fade Down' },
            { direction: 'left', label: 'Fade Left' },
            { direction: 'right', label: 'Fade Right' }
          ].map((item, index) => (
            <FadeInView 
              key={index}
              direction={item.direction as any}
              delay={index * 0.1}
              className="h-full"
            >
              <Card className="h-32 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
                <CardContent className="text-center p-4">
                  <p className="font-semibold text-slate-800">{item.label}</p>
                </CardContent>
              </Card>
            </FadeInView>
          ))}
        </div>
      </div>

      {/* Final section */}
      <FadeInView delay={1} className="text-center py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Enhanced User Experience</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            These smooth transitions and parallax effects create a more engaging and professional interface 
            for your production management system, improving user satisfaction and workflow efficiency.
          </p>
          <Separator className="max-w-xs mx-auto my-8" />
          <div className="space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              Explore Features
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
            </Button>
          </div>
        </div>
      </FadeInView>
    </div>
  );
};

export default AnimationDemo;