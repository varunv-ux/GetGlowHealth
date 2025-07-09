import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Activity, 
  Brain, 
  Eye, 
  Heart, 
  Shield, 
  Sparkles, 
  Users, 
  Zap 
} from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-trust-blue" />,
      title: "AI-Powered Analysis",
      description: "Advanced GPT-4.1 vision technology analyzes your facial features for comprehensive health insights"
    },
    {
      icon: <Activity className="w-6 h-6 text-medical-green" />,
      title: "Health Scoring",
      description: "Get detailed scores for skin health, eye condition, circulation, and facial symmetry"
    },
    {
      icon: <Eye className="w-6 h-6 text-warning-orange" />,
      title: "Detailed Reports",
      description: "Receive comprehensive analysis with deficiency detection and emotional state reading"
    },
    {
      icon: <Heart className="w-6 h-6 text-success-green" />,
      title: "Personalized Recommendations",
      description: "Get customized daily protocols, nutrition advice, and wellness strategies"
    },
    {
      icon: <Shield className="w-6 h-6 text-trust-blue" />,
      title: "Privacy & Security",
      description: "Your data is encrypted and secure with professional-grade privacy protection"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: "Analysis History",
      description: "Track your progress over time with comprehensive analysis history and trends"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-grey to-white">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-trust-blue mr-2" />
              <h1 className="text-xl font-bold text-dark-grey">FaceHealth Pro</h1>
            </div>
            <Button 
              onClick={handleLogin}
              className="bg-trust-blue hover:bg-blue-600 text-white px-6 py-2"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-dark-grey mb-6">
            Your Face Reveals Your
            <span className="text-trust-blue"> Health</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover comprehensive health insights through advanced AI-powered facial analysis. 
            Get personalized recommendations, track your wellness journey, and optimize your health naturally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-trust-blue hover:bg-blue-600 text-white px-8 py-4 text-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Free Analysis
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white px-8 py-4 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-dark-grey mb-4">
              Advanced Health Analysis Features
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge AI technology provides comprehensive health insights 
              that help you understand your body better and make informed wellness decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <CardTitle className="ml-3 text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-trust-blue to-medical-green">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Discover Your Health Insights?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already optimizing their health with AI-powered facial analysis.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-white text-trust-blue hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            <Activity className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-grey text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-trust-blue mr-2" />
            <h4 className="text-xl font-bold">FaceHealth Pro</h4>
          </div>
          <p className="text-gray-400 mb-4">
            Advanced AI-powered facial health analysis for personalized wellness insights.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 FaceHealth Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}