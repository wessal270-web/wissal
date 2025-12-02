
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Association } from "../types";

export type AssociationData = Omit<Association, 'id' | 'refPath'>;

// Add association to the User Subcollection
export async function addMyAssociation(data: Partial<AssociationData>) {
  const user = auth.currentUser;
  if (!user) throw new Error("المستخدم غير مسجل الدخول");

  // Write to subcollection: /users/{uid}/associations
  const associationsRef = collection(db, "users", user.uid, "associations");

  const payload = {
    name: data.name ?? '',
    category: data.category ?? 'youth',
    president: data.president ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    address: data.address ?? '',
    municipality: data.municipality ?? '',
    activityType: data.activityType ?? '',
    workingHours: data.workingHours ?? '',
    foundedYear: Number(data.foundedYear) || new Date().getFullYear(),
    logoUrl: data.logoUrl ?? '',
    
    socialLinks: data.socialLinks ?? {},
    documents: data.documents ?? [],
    location: data.location ?? { lat: 0, lng: 0 },

    ownerId: String(user.uid),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const cleanData = JSON.parse(JSON.stringify(payload));

  await addDoc(associationsRef, cleanData);
}

export async function getMyAssociations() {
  const user = auth.currentUser;
  if (!user) throw new Error("المستخدم غير مسجل الدخول");

  const associationsRef = collection(db, "users", user.uid, "associations");
  const snapshot = await getDocs(associationsRef);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    refPath: docSnap.ref.path,
    ...docSnap.data(),
  }));
}

export async function updateMyAssociation(
  associationId: string,
  data: Partial<AssociationData>
) {
  const user = auth.currentUser;
  if (!user) throw new Error("المستخدم غير مسجل الدخول");

  // Use subcollection path
  const ref = doc(db, "users", user.uid, "associations", associationId);
  
  const cleanData = JSON.parse(JSON.stringify({
      ...data,
      updatedAt: new Date().toISOString(),
  }));

  await updateDoc(ref, cleanData);
}

export async function deleteMyAssociation(associationId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("المستخدم غير مسجل الدخول");

  const ref = doc(db, "users", user.uid, "associations", associationId);
  await deleteDoc(ref);
}
