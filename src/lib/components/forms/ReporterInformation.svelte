<script lang="ts">
let witnessStatus = $state('');
let canContact = $state<boolean | null>(null);
let contactMethod = $state('');
let availableForInfo = $state<boolean | null>(null);
let inSafeLocation = $state<boolean | null>(null);
let needsAssistance = $state<boolean | null>(null);

// Resource needs
let selectedServices = $state<string[]>([]);
let otherService = $state('');
let vehiclesCanReach = $state<boolean | null>(null);
let accessRoute = $state('');
let obstacles = $state('');

const witnessOptions = [
'I am at the scene',
'I can see it from nearby',
'Someone told me about it',
'I heard/saw it on social media',
'Other'
];

const contactMethods = ['Phone', 'SMS', 'App notification'];

const services = [
'Fire Services',
'Medical/EMS',
'Police',
'Search and Rescue',
'Utility Companies (JPS, NWC)',
'Heavy Equipment/Machinery',
'Evacuation Support',
'Other'
];

function toggleService(service: string) {
if (selectedServices.includes(service)) {
selectedServices = selectedServices.filter(s => s !== service);
} else {
selectedServices = [...selectedServices, service];
}
}

function handleSubmit() {
const formData = {
witnessStatus,
canContact,
contactMethod: canContact ? contactMethod : null,
availableForInfo: canContact ? availableForInfo : null,
selectedServices: canContact ? (selectedServices.includes('Other') && otherService
? [...selectedServices.filter(s => s !== 'Other'), `Other: ${otherService}`]
: selectedServices) : [],
inSafeLocation,
needsAssistance,
vehiclesCanReach,
accessRoute,
obstacles
};

console.log('Combined Form Data:', formData);
}
</script>

<div class="reporter-section">
<h2>Reporter Information & Resource Needs</h2>

<!-- Witness Status -->
<div class="form-section">
<h3>Witness Status <span class="required">*</span></h3>
<div class="radio-group">
{#each witnessOptions as option}
<label class="radio-option">
<input
type="radio"
name="witness-status"
value={option}
bind:group={witnessStatus}
/>
<span class="radio-label">{option}</span>
</label>
{/each}
</div>
</div>

<!-- Contact & Resource Needs -->
<div class="form-section">
<h3>Contact & Resource Coordination</h3>

<div class="form-group">
<label class="question">Can first responders contact you?</label>
<div class="boolean-buttons">
<button
type="button"
class="bool-btn {canContact === true ? 'active-yes' : ''}"
onclick={() => canContact = true}
>
Yes
</button>
<button
type="button"
class="bool-btn {canContact === false ? 'active-no' : ''}"
onclick={() => canContact = false}
>
No
</button>
</div>
</div>

{#if canContact === true}
<div class="form-group indent">
<label class="question">Preferred contact method</label>
<div class="contact-methods">
{#each contactMethods as method}
<button
type="button"
class="method-btn {contactMethod === method ? 'active' : ''}"
onclick={() => contactMethod = method}
>
{#if method === 'Phone'}
📞
{:else if method === 'SMS'}
💬
{:else}
🔔
{/if}
{method}
</button>
{/each}
</div>
</div>

<div class="form-group indent">
<label class="question">Are you available to provide more information?</label>
<div class="boolean-buttons">
<button
type="button"
class="bool-btn {availableForInfo === true ? 'active-yes' : ''}"
onclick={() => availableForInfo = true}
>
Yes
</button>
<button
type="button"
class="bool-btn {availableForInfo === false ? 'active-no' : ''}"
onclick={() => availableForInfo = false}
>
No
</button>
</div>
</div>

<!-- Services Needed (only shown if can contact) -->
<div class="form-group indent">
<h4>Which services are needed? <span class="subtitle-text">Select all that apply</span></h4>
<div class="checkbox-grid">
{#each services as service}
<label class="checkbox-option">
<input
type="checkbox"
checked={selectedServices.includes(service)}
onchange={() => toggleService(service)}
/>
<span class="checkbox-label">
<span class="checkbox-icon">
{#if service === 'Fire Services'}🚒
{:else if service === 'Medical/EMS'}🚑
{:else if service === 'Police'}🚓
{:else if service === 'Search and Rescue'}🔍
{:else if service === 'Utility Companies (JPS, NWC)'}⚡
{:else if service === 'Heavy Equipment/Machinery'}🏗️
{:else if service === 'Evacuation Support'}🚶
{:else}📝
{/if}
</span>
{service}
</span>
</label>
{/each}
</div>

{#if selectedServices.includes('Other')}
<div class="other-input">
<label for="other-service">Please specify:</label>
<input
id="other-service"
type="text"
bind:value={otherService}
placeholder="Enter other service needed..."
class="text-input"
/>
</div>
{/if}
</div>
{/if}
</div>

<!-- Safety Status -->
<div class="form-section safety-section">
<h3>Safety Status</h3>

<div class="form-group">
<label class="question">Are you in a safe location?</label>
<div class="boolean-buttons">
<button
type="button"
class="bool-btn {inSafeLocation === true ? 'active-yes' : ''}"
onclick={() => inSafeLocation = true}
>
✓ Yes, I'm safe
</button>
<button
type="button"
class="bool-btn {inSafeLocation === false ? 'active-no' : ''}"
onclick={() => inSafeLocation = false}
>
✗ No, I'm not safe
</button>
</div>
</div>

<div class="form-group">
<label class="question">Do you need assistance?</label>
<div class="boolean-buttons">
<button
type="button"
class="bool-btn urgent {needsAssistance === true ? 'active-yes' : ''}"
onclick={() => needsAssistance = true}
>
🚨 Yes, I need help
</button>
<button
type="button"
class="bool-btn {needsAssistance === false ? 'active-no' : ''}"
onclick={() => needsAssistance = false}
>
No, I'm okay
</button>
</div>
</div>
</div>

<!-- Access Information -->
<div class="form-section">
<h3>Access Information</h3>

<div class="form-group">
<label class="question">Can emergency vehicles reach the location?</label>
<div class="boolean-buttons">
<button
type="button"
class="bool-btn {vehiclesCanReach === true ? 'active-yes' : ''}"
onclick={() => vehiclesCanReach = true}
>
✓ Yes
</button>
<button
type="button"
class="bool-btn {vehiclesCanReach === false ? 'active-no' : ''}"
onclick={() => vehiclesCanReach = false}
>
✗ No
</button>
</div>
</div>

<div class="form-group">
<label for="access-route">Best access route</label>
<textarea
id="access-route"
bind:value={accessRoute}
rows="3"
placeholder="Describe the best route for emergency vehicles..."
class="textarea-input"
></textarea>
</div>

<div class="form-group">
<label for="obstacles">Obstacles blocking access</label>
<textarea
id="obstacles"
bind:value={obstacles}
rows="3"
placeholder="Describe any obstacles, debris, or hazards..."
class="textarea-input"
></textarea>
</div>
</div>

<button type="button" class="submit-btn" onclick={handleSubmit}>
Submit Report
</button>
</div>

<style>
.reporter-section {
max-width: 800px;
margin: 2rem auto;
padding: 2rem;
background: white;
border-radius: 12px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
margin: 0 0 2rem 0;
color: #1f2937;
font-size: 2rem;
border-bottom: 3px solid #3b82f6;
padding-bottom: 0.5rem;
}

h3 {
margin: 0 0 1rem 0;
color: #374151;
font-size: 1.25rem;
font-weight: 600;
}

h4 {
margin: 0 0 0.75rem 0;
color: #374151;
font-size: 1.1rem;
font-weight: 600;
}

.required {
color: #ef4444;
}

.subtitle-text {
font-size: 0.85rem;
font-weight: normal;
color: #6b7280;
}

.form-section {
margin-bottom: 2.5rem;
padding-bottom: 2rem;
border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
border-bottom: none;
}

.safety-section {
background: #fef2f2;
padding: 1.5rem;
border-radius: 8px;
border: 2px solid #fecaca;
}

.form-group {
margin-bottom: 1.5rem;
}

.form-group.indent {
margin-left: 1.5rem;
padding-left: 1rem;
border-left: 3px solid #e5e7eb;
}

label.question {
display: block;
font-weight: 600;
color: #374151;
margin-bottom: 0.75rem;
font-size: 1rem;
}

label {
display: block;
font-weight: 600;
color: #374151;
margin-bottom: 0.5rem;
font-size: 0.95rem;
}

/* Radio Buttons */
.radio-group {
display: flex;
flex-direction: column;
gap: 0.75rem;
}

.radio-option {
display: flex;
align-items: center;
padding: 0.75rem 1rem;
border: 2px solid #e5e7eb;
border-radius: 8px;
cursor: pointer;
transition: all 0.2s;
background: white;
}

.radio-option:hover {
border-color: #3b82f6;
background: #eff6ff;
}

.radio-option:has(input:checked) {
border-color: #3b82f6;
background: #dbeafe;
}

.radio-option input[type="radio"] {
width: 20px;
height: 20px;
margin-right: 0.75rem;
cursor: pointer;
accent-color: #3b82f6;
}

.radio-label {
font-size: 1rem;
color: #374151;
cursor: pointer;
}

/* Checkbox Grid */
.checkbox-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 0.75rem;
margin-bottom: 1rem;
}

.checkbox-option {
display: flex;
align-items: center;
padding: 0.75rem;
border: 2px solid #e5e7eb;
border-radius: 8px;
cursor: pointer;
transition: all 0.2s;
background: white;
}

.checkbox-option:hover {
border-color: #3b82f6;
background: #eff6ff;
}

.checkbox-option:has(input:checked) {
border-color: #3b82f6;
background: #dbeafe;
}

.checkbox-option input[type="checkbox"] {
width: 18px;
height: 18px;
margin-right: 0.5rem;
cursor: pointer;
accent-color: #3b82f6;
}

.checkbox-label {
display: flex;
align-items: center;
gap: 0.5rem;
font-size: 0.9rem;
color: #374151;
cursor: pointer;
}

.checkbox-icon {
font-size: 1.25rem;
}

/* Other Input */
.other-input {
margin-top: 1rem;
padding: 0.75rem;
background: #f9fafb;
border-radius: 8px;
border: 2px dashed #d1d5db;
}

.other-input label {
margin-bottom: 0.5rem;
}

/* Boolean Buttons */
.boolean-buttons {
display: flex;
gap: 0.75rem;
}

.bool-btn {
flex: 1;
padding: 0.75rem 1.5rem;
border: 2px solid #d1d5db;
background: white;
border-radius: 8px;
font-size: 1rem;
font-weight: 600;
cursor: pointer;
transition: all 0.2s;
color: #6b7280;
}

.bool-btn:hover {
border-color: #9ca3af;
background: #f9fafb;
}

.bool-btn.active-yes {
background: #10b981;
border-color: #059669;
color: white;
}

.bool-btn.active-no {
background: #6b7280;
border-color: #4b5563;
color: white;
}

.bool-btn.urgent.active-yes {
background: #ef4444;
border-color: #dc2626;
color: white;
animation: pulse 2s infinite;
}

@keyframes pulse {
0%, 100% {
box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
}
50% {
box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
}
}

/* Contact Methods */
.contact-methods {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
gap: 0.75rem;
}

.method-btn {
padding: 1rem;
border: 2px solid #d1d5db;
background: white;
border-radius: 8px;
font-size: 0.9rem;
font-weight: 600;
cursor: pointer;
transition: all 0.2s;
color: #374151;
display: flex;
flex-direction: column;
align-items: center;
gap: 0.5rem;
}

.method-btn:hover {
border-color: #3b82f6;
background: #eff6ff;
}

.method-btn.active {
background: #3b82f6;
border-color: #2563eb;
color: white;
}

/* Text Inputs */
.text-input,
.textarea-input {
width: 100%;
padding: 0.75rem;
border: 2px solid #d1d5db;
border-radius: 8px;
font-size: 1rem;
font-family: inherit;
transition: all 0.2s;
}

.text-input:focus,
.textarea-input:focus {
outline: none;
border-color: #3b82f6;
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.textarea-input {
resize: vertical;
min-height: 80px;
}

/* Submit Button */
.submit-btn {
width: 100%;
padding: 1rem;
background: #3b82f6;
color: white;
border: none;
border-radius: 8px;
font-size: 1.1rem;
font-weight: 600;
cursor: pointer;
transition: background 0.2s;
margin-top: 1rem;
}

.submit-btn:hover {
background: #2563eb;
}

.submit-btn:active {
transform: translateY(1px);
}

@media (max-width: 640px) {
.reporter-section {
padding: 1.5rem;
}

.boolean-buttons {
flex-direction: column;
}

.contact-methods,
.checkbox-grid {
grid-template-columns: 1fr;
}
}
</style>