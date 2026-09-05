import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Vehicle } from '../types';
import { VEHICLES_DATA } from '../data/cars';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Anonymous Auth helper
export const initAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((cred) => resolve(cred.user))
          .catch((err) => {
            console.warn('Firebase Auth anonymous sign-in note:', err);
            resolve(null);
          });
      }
    });
  });
};

/**
 * Sync / Seed vehicles into Firestore
 * If collection is empty, automatically populates with default vehicles from cars.ts
 */
export const syncVehiclesCollection = async (
  onVehiclesUpdated: (vehicles: Vehicle[]) => void,
  onError?: (err: Error) => void
): Promise<() => void> => {
  try {
    const vehiclesCol = collection(db, 'vehicles');
    
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      vehiclesCol,
      async (snapshot) => {
        if (snapshot.empty) {
          console.log('Firebase vehicles collection is empty. Seeding initial catalog...');
          try {
            const batch = writeBatch(db);
            VEHICLES_DATA.forEach((car) => {
              const carRef = doc(db, 'vehicles', car.id);
              batch.set(carRef, {
                ...car,
                updatedAt: serverTimestamp(),
              });
            });
            await batch.commit();
            console.log('Initial vehicles successfully seeded into Firestore.');
          } catch (seedErr) {
            console.error('Error seeding vehicles to Firestore:', seedErr);
            // Fallback to local data if seed fails
            onVehiclesUpdated(VEHICLES_DATA);
          }
        } else {
          const remoteVehicles: Vehicle[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              brand: data.brand || '',
              model: data.model || '',
              version: data.version || '',
              yearModel: data.yearModel || `${data.year || 2023}/${data.year || 2023}`,
              year: Number(data.year) || 2023,
              category: data.category || 'Sedan',
              price: Number(data.price) || 0,
              fipePrice: Number(data.fipePrice) || Number(data.price) || 0,
              km: Number(data.km) || 0,
              fuel: data.fuel || 'Flex',
              transmission: data.transmission || 'Automático',
              color: data.color || 'Preto',
              plateEnd: data.plateEnd || '0',
              city: data.city || 'São Paulo',
              state: data.state || 'SP',
              images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
                'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
              ],
              featured: Boolean(data.featured),
              tag: data.tag || undefined,
              cautelarApproved: data.cautelarApproved !== false,
              warrantyMonths: Number(data.warrantyMonths) || 12,
              engine: data.engine || '2.0 Turbo',
              powerHp: Number(data.powerHp) || 180,
              acceleration0to100: data.acceleration0to100 || '8.0s',
              topSpeed: data.topSpeed || '210 km/h',
              trunkCapacityLiters: Number(data.trunkCapacityLiters) || 450,
              consumptionCity: data.consumptionCity || '10.0 km/l',
              consumptionHighway: data.consumptionHighway || '13.5 km/l',
              features: Array.isArray(data.features) ? data.features : [],
              description: data.description || '',
            };
          });
          onVehiclesUpdated(remoteVehicles);
        }
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        if (onError) onError(err);
        // Use local data as safe fallback
        onVehiclesUpdated(VEHICLES_DATA);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Failed to initialize Firestore vehicles listener:', error);
    onVehiclesUpdated(VEHICLES_DATA);
    return () => {};
  }
};

/**
 * Add a new vehicle to Firestore
 */
export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<string> => {
  const colRef = collection(db, 'vehicles');
  const docRef = await addDoc(colRef, {
    ...vehicle,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Update an existing vehicle in Firestore
 */
export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<void> => {
  const docRef = doc(db, 'vehicles', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a vehicle from Firestore
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  const docRef = doc(db, 'vehicles', id);
  await deleteDoc(docRef);
};

/**
 * Save lead or proposal in Firestore
 */
export interface LeadData {
  type: 'financing_proposal' | 'test_drive' | 'sell_car_quote' | 'direct_inquiry';
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  vehicleId?: string;
  vehicleName?: string;
  details?: Record<string, any>;
}

export const saveLead = async (lead: LeadData): Promise<string> => {
  try {
    const colRef = collection(db, 'leads');
    const docRef = await addDoc(colRef, {
      ...lead,
      createdAt: serverTimestamp(),
      status: 'novo',
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving lead to Firestore:', error);
    return 'local-fallback-lead';
  }
};
