export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-2xl">
        <p className="text-lg text-gray-600 mb-8">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-gray-600">support@healthcareplus.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Phone</h2>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Address</h2>
            <p className="text-gray-600">
              123 Healthcare Street
              <br />
              Medical District
              <br />
              City, State 12345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
