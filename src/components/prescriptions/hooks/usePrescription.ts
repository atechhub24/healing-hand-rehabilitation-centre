import { useState, useCallback } from "react";
import {
  Prescription,
  PrescriptionFormData,
  Patient,
  Medication,
} from "../types";

export const usePrescription = (
  initialData?: Partial<PrescriptionFormData>
) => {
  const [formData, setFormData] = useState<PrescriptionFormData>({
    patient: {
      name: initialData?.patient?.name || "",
      age: initialData?.patient?.age || "",
      phone: initialData?.patient?.phone || "",
      address: initialData?.patient?.address || "",
    },
    diagnosis: initialData?.diagnosis || "",
    medications: initialData?.medications || [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    notes: initialData?.notes || "",
    doctorName: initialData?.doctorName || "Dr. Laxmi Kanta Mishra",
  });

  const updatePatient = useCallback((patient: Patient) => {
    setFormData((prev) => ({ ...prev, patient }));
  }, []);

  const updateDiagnosis = useCallback((diagnosis: string) => {
    setFormData((prev) => ({ ...prev, diagnosis }));
  }, []);

  const updateMedications = useCallback((medications: Medication[]) => {
    setFormData((prev) => ({ ...prev, medications }));
  }, []);

  const updateDoctorName = useCallback((doctorName: string) => {
    setFormData((prev) => ({ ...prev, doctorName }));
  }, []);

  const updateNotes = useCallback((notes: string) => {
    setFormData((prev) => ({ ...prev, notes }));
  }, []);

  const addMedication = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  }, []);

  const removeMedication = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  }, []);

  const updateMedication = useCallback(
    (index: number, field: keyof Medication, value: string) => {
      setFormData((prev) => ({
        ...prev,
        medications: prev.medications.map((med, i) =>
          i === index ? { ...med, [field]: value } : med
        ),
      }));
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData({
      patient: {
        name: "",
        age: "",
        phone: "",
        address: "",
      },
      diagnosis: "",
      medications: [
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
      notes: "",
      doctorName: "Dr. Laxmi Kanta Mishra",
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const { patient, diagnosis, medications } = formData;

    // Check required patient fields
    if (!patient.name.trim() || !patient.age.trim() || !diagnosis.trim()) {
      return false;
    }

    // Check required medication fields
    for (const med of medications) {
      if (
        !med.name.trim() ||
        !med.dosage.trim() ||
        !med.frequency.trim() ||
        !med.duration.trim()
      ) {
        return false;
      }
    }

    return true;
  }, [formData]);

  const convertToPrescription = useCallback(
    (id: number): Prescription => {
      return {
        id,
        patient: formData.patient,
        date: new Date().toISOString().split("T")[0],
        medications: formData.medications,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        doctorName: formData.doctorName,
        status: "active",
      };
    },
    [formData]
  );

  return {
    formData,
    updatePatient,
    updateDiagnosis,
    updateMedications,
    updateDoctorName,
    updateNotes,
    addMedication,
    removeMedication,
    updateMedication,
    resetForm,
    validateForm,
    convertToPrescription,
  };
};
