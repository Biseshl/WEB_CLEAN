const form = document.getElementById('quote-form');
const output = document.getElementById('quote-output');
const yearNode = document.getElementById('year');

yearNode.textContent = new Date().getFullYear();

const SERVICE_BASE_COST = {
  'End of Lease Cleaning': 260,
  'Deep Cleaning': 220,
  'Regular Home Cleaning': 120,
  'Carpet Cleaning': 110,
  'Upholstery Cleaning': 90,
  'Mattress Cleaning': 70,
  'Oven Cleaning': 95,
  'Barbecue Cleaning': 85,
  'Builders Cleaning': 280,
  'Window Cleaning': 105,
  'Pressure Washing': 140,
  'Gutter Cleaning': 150,
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const name = data.get('name')?.toString().trim() || 'Customer';
  const postcode = data.get('postcode')?.toString();
  const bedrooms = Number(data.get('bedrooms'));
  const bathrooms = Number(data.get('bathrooms'));
  const priority = data.get('priority')?.toString();
  const services = data.getAll('services').map((s) => s.toString());

  if (!services.length) {
    output.innerHTML = '<h3>Please select at least one cleaning service.</h3>';
    return;
  }

  const homeSizeFactor = 1 + bedrooms * 0.12 + bathrooms * 0.1;
  const priorityFactor = priority === 'urgent' ? 1.25 : priority === 'deep' ? 1.12 : 1;

  const serviceSubtotal = services.reduce((sum, s) => sum + (SERVICE_BASE_COST[s] || 0), 0);
  const estimate = serviceSubtotal * homeSizeFactor * priorityFactor;
  const low = Math.round(estimate * 0.9);
  const high = Math.round(estimate * 1.15);

  const estimatedHours = Math.max(2, Math.round((services.length * 1.2 + bedrooms * 0.6 + bathrooms * 0.7) * (priorityFactor + 0.1)));

  const aiPlan = [];
  if (services.includes('End of Lease Cleaning') || services.includes('Builders Cleaning')) {
    aiPlan.push('Allocate a two-cleaner team and include a completion checklist for inspection readiness.');
  }
  if (services.includes('Deep Cleaning')) {
    aiPlan.push('Focus first on kitchen + bathroom sanitisation, then high-touch surfaces and skirting boards.');
  }
  if (services.includes('Carpet Cleaning') || services.includes('Upholstery Cleaning') || services.includes('Mattress Cleaning')) {
    aiPlan.push('Schedule fabric/fibre cleaning after dry dust removal for better stain extraction.');
  }
  if (services.includes('Window Cleaning') || services.includes('Gutter Cleaning') || services.includes('Pressure Washing')) {
    aiPlan.push('Plan exterior works early in the day to maximise drying time and safety checks.');
  }
  if (!aiPlan.length) {
    aiPlan.push('Use a standard room-by-room cleaning flow: declutter, dust, wipe, vacuum, mop, final quality check.');
  }

  output.innerHTML = `
    <h3>AI Quote for ${name}</h3>
    <p><strong>Location:</strong> Melbourne (${postcode})</p>
    <p><strong>Estimated range:</strong> <strong>AUD $${low} – $${high}</strong></p>
    <p><strong>Estimated duration:</strong> ${estimatedHours} hours</p>
    <p><strong>Recommended service mix:</strong> ${services.join(', ')}</p>
    <h4>AI Cleaning Plan</h4>
    <ul>${aiPlan.map((item) => `<li>${item}</li>`).join('')}</ul>
    <p class="small-note">This is an automated estimate, not a final invoice. Final pricing can change after scope confirmation.</p>
  `;
});
