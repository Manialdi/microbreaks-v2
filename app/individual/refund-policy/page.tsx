
export const metadata = {
    title: "Refund Policy - MicroBreaks Personal",
}

export default function RefundPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Refund Policy</h1>
            <div className="prose prose-slate max-w-none text-slate-600">
                <p><strong>Last Updated: December 24, 2025</strong></p>

                <h3>7-Day Money-Back Guarantee</h3>
                <p>We want you to be completely satisfied with MicroBreaks. If you are not happy with the product for any reason, you may request a full refund within <strong>7 days</strong> of your purchase.</p>

                <h3>How to Request a Refund</h3>
                <p>To request a refund, please email us at <a href="mailto:support@micro-breaks.com" className="text-blue-600 hover:underline">support@micro-breaks.com</a> with your:</p>
                <ul>
                    <li>Order ID or Receipt Number</li>
                    <li>Email address used for purchase</li>
                </ul>

                <h3>Processing Time</h3>
                <p>Once approved, refunds are processed immediately but may take 5-10 business days to appear on your statement, depending on your bank.</p>

                <h3>Exclusions</h3>
                <p>Refund requests made after the 7-day window will be handled on a case-by-case basis but are generally not eligible for a refund.</p>
            </div>
        </div>
    )
}
