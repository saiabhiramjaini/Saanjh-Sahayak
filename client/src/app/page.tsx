import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Building,
  FileText,
  MessageCircle,
  ArrowRight,
  Check,
  Star,
  Clock,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Logo/>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-gray-600 hover:text-teal-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-teal-600 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#faq"
              className="text-gray-600 hover:text-teal-600 transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-teal-600 hover:bg-teal-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 to-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 leading-tight">
                Transforming <span className="text-teal-600">Elderly Care</span>{" "}
                Management
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Saanjh Sahayak provides a comprehensive platform for old age
                home management, streamlining patient care, health monitoring,
                and doctor-caretaker communication with AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4"></div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -top-10 -right-10 w-30 h-30 bg-teal-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-5 -left-10 w-30 h-30 bg-teal-100 rounded-full opacity-50"></div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <img
                  src="/hero-image.png"
                  alt="Elderly care dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Comprehensive Features
            </h2>
            <p className="text-lg text-gray-600">
              Our platform offers a complete suite of tools designed
              specifically for old age home management and elderly care
              coordination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Role-based Access
                </h3>
                <p className="text-gray-600">
                  Separate dashboards for caretakers and doctors with distinct
                  roles and responsibilities, ensuring the right information
                  reaches the right people.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Customized interfaces for each role</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Secure permission management</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Streamlined workflows</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600">
                  Our Gemini LLM model analyzes health reports and provides
                  detailed insights and recommendations for better patient care.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Automated health report analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Personalized care recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Early issue detection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-none shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Chatbot</h3>
                <p className="text-gray-600">
                  AI chatbot for medical queries with text and image-based
                  diagnosis capabilities, providing instant assistance.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>24/7 medical query assistance</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Image-based symptom analysis</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-teal-600 mr-2 shrink-0" />
                    <span>Instant care recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Our platform streamlines elderly care management through an
              intuitive workflow designed for both caretakers and medical
              professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xl z-10">
                1
              </div>
              <div className="pt-16 pb-8 px-6 bg-gray-50 rounded-lg h-full">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Patient Registration
                </h3>
                <p className="text-gray-600 text-center">
                  Caretakers register patients with comprehensive profiles
                  including medical history, medications, and emergency
                  contacts.
                </p>
              </div>
              <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-teal-200 -z-10"></div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xl z-10">
                2
              </div>
              <div className="pt-16 pb-8 px-6 bg-gray-50 rounded-lg h-full">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Health Monitoring
                </h3>
                <p className="text-gray-600 text-center">
                  Regular health reports are submitted and analyzed by our AI
                  system to provide insights and recommendations.
                </p>
              </div>
              <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-teal-200 -z-10"></div>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xl z-10">
                3
              </div>
              <div className="pt-16 pb-8 px-6 bg-gray-50 rounded-lg h-full">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Doctor Evaluation
                </h3>
                <p className="text-gray-600 text-center">
                  Doctors review the reports, provide prescriptions, and
                  communicate directly with caretakers for coordinated care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our platform and how it can
              help your organization.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "How does the AI-powered analysis work?",
                  answer:
                    "Our platform uses a Gemini LLM model to analyze health reports submitted by caretakers. The AI identifies patterns, potential health concerns, and provides recommendations for care. It also suggests precautions and specialist consultations when necessary.",
                },
                {
                  question:
                    "How much training is required to use the platform?",
                  answer:
                    "Our platform is designed to be intuitive and user-friendly. Most users can get started with minimal training. We provide comprehensive documentation, video tutorials, and offer free onboarding sessions for new organizations.",
                },
                {
                  question:
                    "Can the platform be customized for our specific needs?",
                  answer:
                    "Yes, our platform offers various customization options to meet the specific needs of different care facilities. Contact our team to discuss your requirements and how we can tailor the solution for your organization.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
              <img src="/logo.png" className="h-12 text-teal-600 mr-2 bg-white" />
                <h3 className="text-xl font-bold text-white">Saanjh Sahayak</h3>
              </div>
              <p className="text-gray-300 w-64">
                Comprehensive Old Age Home Management Platform
              </p>
            </div>

            {/* Quick Links positioned to the far right */}
            <div className="md:text-left">
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Saanjh Sahayak. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
