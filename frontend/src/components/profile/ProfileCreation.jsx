import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../../api/profileApi';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import toast from 'react-hot-toast';

const ProfileCreation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    height: '',
    maritalStatus: '',
    phone: '',
    
    // Location
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    
    // Religious Info
    religion: '',
    caste: '',
    
    // Education & Career
    education: {
      highestQualification: '',
      institution: '',
      employedIn: '',
      occupation: '',
      organization: '',
      annualIncome: ''
    },
    
    // Family Details
    family: {
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      brothers: 0,
      brothersMarried: 0,
      sisters: 0,
      sistersMarried: 0,
      familyType: '',
      familyStatus: '',
      familyValues: ''
    },
    
    // Lifestyle
    lifestyle: {
      diet: '',
      smoking: '',
      drinking: ''
    },
    
    aboutMe: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createProfile(formData);
      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create profile');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create Your Profile
          </h2>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {step} of 5</span>
              <span className="text-sm font-medium text-gray-700">{(step / 5) * 100}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-love h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                  ]}
                  required
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Height (in cm)"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g., 170"
                  required
                />

                <Select
                  label="Marital Status"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  options={[
                    { value: 'never_married', label: 'Never Married' },
                    { value: 'divorced', label: 'Divorced' },
                    { value: 'widowed', label: 'Widowed' },
                    { value: 'separated', label: 'Separated' }
                  ]}
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                  required
                />
              </div>
            )}

            {/* Step 2: Location & Religious Info */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Location & Religious Information</h3>
                
                <Input
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="State"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Country"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Pincode"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Caste"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Step 3: Education & Career */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Education & Career</h3>
                
                <Input
                  label="Highest Qualification"
                  name="education.highestQualification"
                  value={formData.education.highestQualification}
                  onChange={handleChange}
                  placeholder="e.g., B.Tech, MBA, etc."
                  required
                />

                <Input
                  label="Institution/College"
                  name="education.institution"
                  value={formData.education.institution}
                  onChange={handleChange}
                />

                <Select
                  label="Employed In"
                  name="education.employedIn"
                  value={formData.education.employedIn}
                  onChange={handleChange}
                  options={[
                    { value: 'private', label: 'Private Sector' },
                    { value: 'government', label: 'Government' },
                    { value: 'business', label: 'Business' },
                    { value: 'self_employed', label: 'Self Employed' },
                    { value: 'not_working', label: 'Not Working' }
                  ]}
                />

                <Input
                  label="Occupation"
                  name="education.occupation"
                  value={formData.education.occupation}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                />

                <Input
                  label="Organization"
                  name="education.organization"
                  value={formData.education.organization}
                  onChange={handleChange}
                />

                <Select
                  label="Annual Income"
                  name="education.annualIncome"
                  value={formData.education.annualIncome}
                  onChange={handleChange}
                  options={[
                    { value: '0-2L', label: '0-2 Lakhs' },
                    { value: '2-5L', label: '2-5 Lakhs' },
                    { value: '5-10L', label: '5-10 Lakhs' },
                    { value: '10-20L', label: '10-20 Lakhs' },
                    { value: '20-50L', label: '20-50 Lakhs' },
                    { value: '50L+', label: '50+ Lakhs' }
                  ]}
                />
              </div>
            )}

            {/* Step 4: Family Details */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Family Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Father's Name"
                    name="family.fatherName"
                    value={formData.family.fatherName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Father's Occupation"
                    name="family.fatherOccupation"
                    value={formData.family.fatherOccupation}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Mother's Name"
                    name="family.motherName"
                    value={formData.family.motherName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Mother's Occupation"
                    name="family.motherOccupation"
                    value={formData.family.motherOccupation}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input
                    label="Brothers"
                    type="number"
                    name="family.brothers"
                    value={formData.family.brothers}
                    onChange={handleChange}
                    min="0"
                  />
                  <Input
                    label="Married"
                    type="number"
                    name="family.brothersMarried"
                    value={formData.family.brothersMarried}
                    onChange={handleChange}
                    min="0"
                  />
                  <Input
                    label="Sisters"
                    type="number"
                    name="family.sisters"
                    value={formData.family.sisters}
                    onChange={handleChange}
                    min="0"
                  />
                  <Input
                    label="Married"
                    type="number"
                    name="family.sistersMarried"
                    value={formData.family.sistersMarried}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <Select
                  label="Family Type"
                  name="family.familyType"
                  value={formData.family.familyType}
                  onChange={handleChange}
                  options={[
                    { value: 'joint', label: 'Joint Family' },
                    { value: 'nuclear', label: 'Nuclear Family' }
                  ]}
                />

                <Select
                  label="Family Status"
                  name="family.familyStatus"
                  value={formData.family.familyStatus}
                  onChange={handleChange}
                  options={[
                    { value: 'middle_class', label: 'Middle Class' },
                    { value: 'upper_middle_class', label: 'Upper Middle Class' },
                    { value: 'rich', label: 'Rich' },
                    { value: 'affluent', label: 'Affluent' }
                  ]}
                />

                <Select
                  label="Family Values"
                  name="family.familyValues"
                  value={formData.family.familyValues}
                  onChange={handleChange}
                  options={[
                    { value: 'traditional', label: 'Traditional' },
                    { value: 'moderate', label: 'Moderate' },
                    { value: 'liberal', label: 'Liberal' }
                  ]}
                />
              </div>
            )}

            {/* Step 5: Lifestyle & About */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Lifestyle & About</h3>
                
                <Select
                  label="Diet"
                  name="lifestyle.diet"
                  value={formData.lifestyle.diet}
                  onChange={handleChange}
                  options={[
                    { value: 'vegetarian', label: 'Vegetarian' },
                    { value: 'non_vegetarian', label: 'Non-Vegetarian' },
                    { value: 'eggetarian', label: 'Eggetarian' }
                  ]}
                />

                <Select
                  label="Smoking"
                  name="lifestyle.smoking"
                  value={formData.lifestyle.smoking}
                  onChange={handleChange}
                  options={[
                    { value: 'no', label: 'No' },
                    { value: 'yes', label: 'Yes' },
                    { value: 'occasionally', label: 'Occasionally' }
                  ]}
                />

                <Select
                  label="Drinking"
                  name="lifestyle.drinking"
                  value={formData.lifestyle.drinking}
                  onChange={handleChange}
                  options={[
                    { value: 'no', label: 'No' },
                    { value: 'yes', label: 'Yes' },
                    { value: 'occasionally', label: 'Occasionally' }
                  ]}
                />

                <div className="mb-4">
                  <label className="label">About Me</label>
                  <textarea
                    name="aboutMe"
                    value={formData.aboutMe}
                    onChange={handleChange}
                    rows="5"
                    className="input-field resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button type="button" variant="secondary" onClick={prevStep}>
                  Previous
                </Button>
              )}
              
              {step < 5 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="ml-auto">
                  Create Profile
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
