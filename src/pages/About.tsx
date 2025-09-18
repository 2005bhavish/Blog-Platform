import React from 'react';
import { PenTool, Users, Zap, Heart, BookOpen, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { icon: Users, label: 'Active Writers', value: '1,000+', color: 'text-primary' },
    { icon: BookOpen, label: 'Stories Published', value: '5,000+', color: 'text-emerald-500' },
    { icon: Heart, label: 'Reader Interactions', value: '50,000+', color: 'text-red-500' },
    { icon: Globe, label: 'Countries Reached', value: '80+', color: 'text-blue-500' }
  ];

  const features = [
    {
      icon: PenTool,
      title: 'Advanced Editor',
      description: 'Rich text editing with image uploads, formatting tools, and real-time preview.'
    },
    {
      icon: Zap,
      title: 'Real-time Publishing',
      description: 'See your stories go live instantly with real-time updates across all devices.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with writers worldwide and share your stories with a passionate audience.'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-2xl mb-6 shadow-glow">
                <PenTool className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">Mitt Arv</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Mitt Arv is a modern blogging platform where stories come to life. We empower writers 
              to share their heritage, experiences, and creativity with a global community through 
              advanced tools and real-time publishing capabilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-hero">
                <Link to="/register">Start Writing Today</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Explore Stories</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-0 bg-background/80 backdrop-blur-sm hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose Mitt Arv?
            </h2>
            <p className="text-lg text-muted-foreground">
              We've built the ultimate writing platform with cutting-edge features 
              to help you create, publish, and connect with readers worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 bg-card hover:shadow-elegant transition-all duration-300 hover:transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-primary group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Preserving Stories, Building Connections
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  At Mitt Arv (My Heritage), we believe every story deserves to be told and preserved. 
                  Our platform bridges the gap between traditional storytelling and modern technology, 
                  creating a space where writers can share their heritage, experiences, and imagination.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you're documenting family history, sharing travel adventures, or crafting 
                  fictional worlds, Mitt Arv provides the tools and community to bring your stories to life.
                </p>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-gradient-primary rounded-3xl p-8 flex items-center justify-center shadow-glow">
                  <div className="text-center text-white">
                    <BookOpen className="w-16 h-16 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold mb-2">Stories Matter</h4>
                    <p className="text-white/90">Every voice has the power to inspire, educate, and connect us all.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of writers who have already started their journey on Mitt Arv. 
              Your story matters, and we're here to help you tell it.
            </p>
            <Button asChild size="lg" className="btn-hero">
              <Link to="/register">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;