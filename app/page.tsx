"use client"

import { LoginForm } from "@/components/login-form"
import { Shield, Heart, Users, Lock, AlertTriangle, FileText, Zap, Globe, CheckCircle, ArrowRight, Clock, Star, Smartphone, Upload, Search, Bell, Download, Share2, Activity, TrendingUp, Calendar, MapPin } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const correctType = searchParams.get('type')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/Vhealth_logo.jpg" alt="V Health Logo" className="h-20 w-20 rounded-full object-cover object-center scale-110 border-2 border-gray-300" />
              <div className="ml-2">
                <h1 className="text-xl font-bold text-foreground">V Health</h1>
                <p className="text-sm text-muted-foreground">Health Vault of India</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Powered by Digital India Initiative</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 border-b border-border/20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-balance text-foreground lg:text-5xl">
                Your Complete Health History, Always Accessible
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Never lose a medical report again. Store all your health records in one place and get AI-powered emergency summaries when you need them most.
              </p>
            </div>

            {/* Quick Features */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground">Secure Storage</h3>
                  <p className="text-sm text-muted-foreground">Your medical data protected and always available</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Users className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground">Doctor Access</h3>
                  <p className="text-sm text-muted-foreground">Verified doctors can upload reports directly</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Heart className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground">AI Emergency</h3>
                  <p className="text-sm text-muted-foreground">Critical health info for emergency situations</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-card-foreground">Lifetime Storage</h3>
                  <p className="text-sm text-muted-foreground">Complete medical history in one place</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="space-y-4">
              {error === 'wrong-user-type' && (
                <Card className="bg-destructive/10 border-destructive/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-semibold">Wrong Account Type</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      This email is registered as a {correctType}. Please use the {correctType} login tab.
                    </p>
                  </CardContent>
                </Card>
              )}
              <LoginForm />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-border/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b border-blue-300/60">Making Healthcare Better</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Numbers that show the real impact of organized healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">75%</div>
              <p className="text-muted-foreground">Faster doctor consultations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">90%</div>
              <p className="text-muted-foreground">Reduction in lost reports</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">24/7</div>
              <p className="text-muted-foreground">Emergency access availability</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">100%</div>
              <p className="text-muted-foreground">Mobile accessibility</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 border-b border-border/20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6 pb-2 border-b border-green-300/60">Real Life Benefits</h3>
              <p className="text-lg text-muted-foreground mb-6">
                See how V Health makes healthcare easier for everyone - patients, doctors, and families.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">For Patients</h4>
                    <p className="text-sm text-muted-foreground">No more lost reports, instant access anywhere, emergency-ready health info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">For Doctors</h4>
                    <p className="text-sm text-muted-foreground">Complete patient history, faster diagnosis, better treatment decisions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">For Emergencies</h4>
                    <p className="text-sm text-muted-foreground">Life-saving information available instantly when every second counts</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Simple & Effective</h4>
                <p className="text-muted-foreground">
                  Built for real people with real healthcare needs. Easy to use, powerful when you need it most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How V Health Works & Why It's Better */}
      <section className="bg-muted/30 py-20 border-b border-border/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4 pb-2 border-b border-orange-300/60">How V Health Makes Healthcare Easier</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to organize your health history and never lose important medical information again
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-10 w-10 text-blue-500" />
              </div>
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">1</div>
              <h4 className="text-xl font-semibold mb-3">Upload & Store</h4>
              <p className="text-muted-foreground mb-4">
                Upload all your medical reports once and access them anywhere. No more carrying physical copies or losing important documents.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Any medical document</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Instant search capability</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Timeline organization</li>
              </ul>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-10 w-10 text-red-500" />
              </div>
              <div className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">2</div>
              <h4 className="text-xl font-semibold mb-3">AI Emergency Summary</h4>
              <p className="text-muted-foreground mb-4">
                In emergencies, doctors get instant AI summaries of your critical health info - allergies, medications, and conditions that could save your life.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Life-saving allergy alerts</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Current medication list</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Critical condition warnings</li>
              </ul>
            </Card>
            
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-green-500" />
              </div>
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">3</div>
              <h4 className="text-xl font-semibold mb-3">Doctor Integration</h4>
              <p className="text-muted-foreground mb-4">
                Doctors can upload reports directly to your account and access your complete medical history instantly, leading to better treatment decisions.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Direct report uploads</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Complete patient history</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Emergency access when needed</li>
              </ul>
            </Card>
          </div>
          
          {/* Visual Flow */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Storage Flow */}
              <div className="text-center">
                <h5 className="font-semibold mb-4 text-foreground">Normal Storage</h5>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Medical Reports</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                    <Heart className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Health Vault</span>
                  </div>
                </div>
              </div>
              
              {/* Emergency Flow */}
              <div className="text-center">
                <h5 className="font-semibold mb-4 text-foreground">Emergency Access</h5>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                    <Heart className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Health Vault</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
                    <Zap className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">AI Summary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="bg-muted/30 py-20 border-b border-border/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 pb-2 border-b border-purple-300/60">Everything You Need</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features designed for modern healthcare management
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h4 className="text-2xl font-bold text-foreground mb-6">For Patients</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Easy Upload</h5>
                    <p className="text-sm text-muted-foreground">Drag & drop any medical document - PDFs, images, reports</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Timeline View</h5>
                    <p className="text-sm text-muted-foreground">See your health journey organized chronologically</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Smart Notifications</h5>
                    <p className="text-sm text-muted-foreground">Get notified when doctors access your emergency info</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Share2 className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Easy Sharing</h5>
                    <p className="text-sm text-muted-foreground">Share specific reports with doctors instantly</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-12 w-12 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Always With You</h4>
                <p className="text-muted-foreground mb-6">
                  Your complete health history in your pocket. Access from any device, anywhere, anytime.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">📱</div>
                    <p className="text-xs text-muted-foreground">Mobile</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">💻</div>
                    <p className="text-xs text-muted-foreground">Desktop</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">📟</div>
                    <p className="text-xs text-muted-foreground">Tablet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-4">Doctor Dashboard</h4>
                <p className="text-muted-foreground mb-6">
                  Streamlined interface for healthcare professionals to manage patient records efficiently.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">⚡</div>
                    <p className="text-xs text-muted-foreground">Fast</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">🔒</div>
                    <p className="text-xs text-muted-foreground">Secure</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">📊</div>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold text-foreground mb-6">For Doctors</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Direct Upload</h5>
                    <p className="text-sm text-muted-foreground">Upload reports directly to patient accounts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Search className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Complete History</h5>
                    <p className="text-sm text-muted-foreground">Access full patient medical history instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Zap className="h-5 w-5 text-red-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Emergency Access</h5>
                    <p className="text-sm text-muted-foreground">Get AI-generated emergency summaries in critical situations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Activity className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h5 className="font-semibold mb-1">Track Access</h5>
                    <p className="text-sm text-muted-foreground">All access is logged and patients are notified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20 border-b border-border/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-4 pb-2 border-b border-cyan-300/60">Ready to Organize Your Health?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start building your digital health vault today. Upload your first report and see how easy healthcare management can be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Easy to get started</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Works on any device</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Always accessible</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-4xl mx-auto">
            <h4 className="text-xl font-semibold mb-6">What happens after you sign up?</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-500 font-bold">1</span>
                </div>
                <h5 className="font-semibold mb-2">Create Account</h5>
                <p className="text-sm text-muted-foreground">Quick signup with email or Google</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-500 font-bold">2</span>
                </div>
                <h5 className="font-semibold mb-2">Visit Your Doctor</h5>
                <p className="text-sm text-muted-foreground">Your doctor uploads reports directly to your account</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-500 font-bold">3</span>
                </div>
                <h5 className="font-semibold mb-2">Access Anywhere</h5>
                <p className="text-sm text-muted-foreground">View, organize, and share your health data instantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img src="/Vhealth_logo.jpg" alt="V Health Logo" className="h-16 w-16 rounded-full object-cover object-center scale-110 border-2 border-gray-300" />
                <div className="ml-2">
                  <h4 className="text-lg font-bold text-foreground">V Health</h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Making healthcare accessible and organized for everyone.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span>Built for better healthcare</span>
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Features</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Digital Health Records</li>
                <li>AI Emergency Summary</li>
                <li>Doctor Integration</li>
                <li>Timeline View</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">For Users</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Patient Portal</li>
                <li>Doctor Dashboard</li>
                <li>Mobile Access</li>
                <li>Emergency Access</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-foreground mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>How it Works</li>
                <li>Getting Started</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">© 2025 V Health. All rights reserved.</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>🇮🇳 Made in India</span>
                <span>•</span>
                <span>Hackathon Project</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
