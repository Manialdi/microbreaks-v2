
export const metadata = {
    title: "Refund Policy - MicroBreaks Personal",
}

export default function RefundPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Refund Policy</h1>
            <p className="text-slate-500 mb-8">Last Updated: December 24, 2025</p>

            <div className="prose prose-slate max-w-none text-slate-600 space-y-8">
                <p>
                    Micro-breaks offers users the ability to explore the product before making a purchase.
                    As a result, our refund policy is designed to reflect the nature of our one-time, lifetime access model.
                </p>

                <section>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">No Refunds After Purchase</h3>
                    <p>
                        When you purchase lifetime access to Micro-breaks, you receive immediate and permanent access to all premium features.
                        Because users can freely use Micro-breaks and decide to upgrade at their own pace, all purchases are final and
                        non-refundable, except where required by applicable law.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Try Before You Upgrade</h3>
                    <p>
                        Micro-breaks allows users to experience the product before upgrading. You are encouraged to explore the features
                        and ensure the product fits your needs before completing a purchase. Upgrading is optional and can be done at any time.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Why We Don’t Offer Refunds</h3>
                    <p>
                        Lifetime access is a one-time purchase that unlocks permanent usage. Once access is granted, it cannot be revoked or returned.
                        For this reason, we do not offer refunds after purchase.
                    </p>
                    <p className="mt-2">This approach helps us keep pricing simple, fair, and transparent for all users.</p>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Exceptional Circumstances</h3>
                    <p>
                        In rare cases involving technical errors, duplicate charges, or billing issues, we may review refund requests on a
                        case-by-case basis. Approval in such cases is at our sole discretion.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Contact Us</h3>
                    <p>
                        If you have questions about this policy or believe you were charged in error, please contact us at:
                    </p>
                    <p className="mt-2">
                        📧 <a href="mailto:support@micro-breaks.com" className="text-blue-600 hover:underline">support@micro-breaks.com</a>
                    </p>
                </section>

            </div>
        </div>
    )
}
