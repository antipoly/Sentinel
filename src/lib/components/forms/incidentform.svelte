<script lang="ts">
    import { onMount } from 'svelte';

    let emergencyType: string = '';
    let firstRespondersPresent: string = '';
    let geolocation: string = 'Loading...';
    let description: string = '';

    const incidentTypes = [
        'Earthquake',
        'Wildfire',
        'Tsunami',
        'Adverse Weather',
        'Flash Flood',
        'Crime',
        'Tornado'
    ];

    onMount(() => {
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    geolocation = `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
                },
                () => {
                    geolocation = 'Unable to get location';
                }
            );
        } else {
            geolocation = 'Geolocation not supported';
        }
    });

    function handleSubmit(e: Event) {
        e.preventDefault();
        console.log({
            emergencyType,
            firstRespondersPresent,
            geolocation,
            description,
            timestamp: new Date().toISOString()
        });
        alert('Incident reported! Check console for details.');
    }
</script>

<div class="container">
    <h1>Emergency Incident Report</h1>
    
    <form on:submit={handleSubmit}>
        <!-- Geolocation -->
        <div class="form-group">
            <label for="location">Location (Auto-detected)</label>
            <input
                id="location"
                type="text"
                bind:value={geolocation}
                readonly
            />
        </div>

        <!-- Emergency Type Dropdown -->
        <div class="form-group">
            <label for="emergency-type">Emergency Type <span class="required">*</span></label>
            <select
                id="emergency-type"
                bind:value={emergencyType}
                required
            >
                <option value="">Select emergency type</option>
                {#each incidentTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>
        </div>

        <!-- First Responders Present -->
        <div class="form-group">
            <label for="first-responders">Are there any first responders? <span class="required">*</span></label>
            <select
                id="first-responders"
                bind:value={firstRespondersPresent}
                required
            >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
            </select>
        </div>

        <!-- Description -->
        <div class="form-group">
            <label for="description">Description (Optional)</label>
            <textarea
                id="description"
                bind:value={description}
                rows="4"
                placeholder="Provide additional details about the incident..."
            ></textarea>
        </div>

        <!-- Submit Button -->
        <button type="submit">Report Incident</button>
    </form>

    <!-- Display Selected Values -->
    {#if emergencyType || firstRespondersPresent}
        <div class="preview">
            <h3>Current Selection:</h3>
            <ul>
                {#if emergencyType}<li><strong>Emergency Type:</strong> {emergencyType}</li>{/if}
                {#if firstRespondersPresent}<li><strong>First Responders:</strong> {firstRespondersPresent}</li>{/if}
                <li><strong>Location:</strong> {geolocation}</li>
            </ul>
        </div>
    {/if}
</div>

<style>
    .container {
        max-width: 600px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    h1 {
        color: #dc2626;
        margin-bottom: 1.5rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #374151;
    }

    .required {
        color: #dc2626;
    }

    input, select, textarea {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 1rem;
    }

    input:focus, select:focus, textarea:focus {
        outline: none;
        border-color: #dc2626;
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    input[readonly] {
        background: #f3f4f6;
        color: #6b7280;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background: #dc2626;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
    }

    button:hover {
        background: #b91c1c;
    }

    .preview {
        margin-top: 2rem;
        padding: 1rem;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-radius: 4px;
    }

    .preview h3 {
        margin-top: 0;
        color: #374151;
    }

    .preview ul {
        list-style: none;
        padding: 0;
    }

    .preview li {
        margin-bottom: 0.5rem;
        color: #6b7280;
    }
</style>