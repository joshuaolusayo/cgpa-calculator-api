import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  query,
  where,
  DocumentData,
  updateDoc,
  DocumentReference,
  UpdateData,
} from "firebase/firestore";
import db from "../config/firebase";

type FirestoreModel<T> = {
  _id: string;
} & T;

export class GenericController<T> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  private getCollectionRef() {
    return collection(db, this.collectionName);
  }

  private docToModel(doc: FirestoreModel<T>): FirestoreModel<T> {
    return {
      _id: doc._id,
      ...doc,
    } as FirestoreModel<T>;
  }

  async read_records(conditions?: any): Promise<FirestoreModel<T>[]> {
    try {
      const queryConditions = !conditions
        ? []
        : Object.keys(conditions).map((field) =>
            where(field, "==", conditions[field])
          );

      const q = query(this.getCollectionRef(), ...queryConditions);
      const querySnapshot = await getDocs(q);

      const result: FirestoreModel<T>[] = [];
      querySnapshot.forEach((doc) => {
        result.push(
          this.docToModel({ _id: doc.id, ...doc.data() } as FirestoreModel<T>)
        );
      });

      console.log(result);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create_record(data: T): Promise<string> {
    try {
      const docRef = await addDoc(this.getCollectionRef(), data);

      return docRef.id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // update records

  async delete_record_by_id(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Other CRUD operations and utility methods can be added here
}
