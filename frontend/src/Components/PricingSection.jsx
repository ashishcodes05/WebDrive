import React from "react"
import { Check } from "lucide-react"

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "$0",
      period: "/month",
      description: "Perfect for personal use and light storage.",
      features: [
        "5GB Cloud Storage",
        "Secure File Encryption",
        "Basic File Sharing",
        "Access on All Devices",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "Ideal for professionals and growing needs.",
      features: [
        "100GB Cloud Storage",
        "Advanced Encryption",
        "Priority Upload Speed",
        "Secure Sharing Controls",
        "Real-Time Search",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "$19",
      period: "/month",
      description: "Built for teams and business workflows.",
      features: [
        "1TB Cloud Storage",
        "Enterprise-Grade Security",
        "Team Collaboration",
        "Role-Based Permissions",
        "Priority Support",
      ],
      highlighted: false,
    },
  ]

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-sm backdrop-blur-md">
          Pricing Plans
        </div>
        <h2 className="text-white font-semibold text-4xl md:text-5xl mt-6">
          Simple, Transparent Pricing
        </h2>

        <p className="text-white/60 max-w-xl mx-auto mt-4">
          Choose a plan that fits your storage needs. Upgrade anytime as you grow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 border transition-all duration-300 backdrop-blur-xl
                ${
                  plan.highlighted
                    ? "bg-blue-600/10 border-blue-500/40 scale-105"
                    : "bg-white/[0.03] border-white/10 hover:border-blue-500/30"
                }`}
            >

              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <h3 className="text-white text-xl font-semibold">
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline justify-center">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-white/60 ml-1">
                  {plan.period}
                </span>
              </div>

              <p className="text-white/60 mt-4 text-sm">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-4 text-left">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                    <Check className="text-blue-400 w-4 h-4" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-8 w-full py-3 rounded-xl font-medium transition-all duration-300
                  ${
                    plan.highlighted
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
              >
                {plan.name === "Basic" ? "Get Started" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
