export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Online Consultations</h2>
          <p className="text-gray-600">
            Connect with healthcare providers from the comfort of your home.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Lab Tests</h2>
          <p className="text-gray-600">
            Book and manage your lab tests with trusted laboratories.
          </p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Emergency Services</h2>
          <p className="text-gray-600">
            24/7 emergency medical assistance and ambulance services.
          </p>
        </div>
      </div>
    </div>
  );
}
