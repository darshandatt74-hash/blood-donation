import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const TopDonors = () => {

const [topDonors,setTopDonors] = useState([]);

useEffect(()=>{

const unsub = onSnapshot(collection(db,"donations"), async (snap)=>{

const donations = snap.docs.map(d=>d.data());

const counts = {};

donations.forEach(d=>{

if(!counts[d.userId]){

counts[d.userId]=0;

}

counts[d.userId]++;

});

const usersSnap = await new Promise(resolve=>{
onSnapshot(collection(db,"users"),resolve);
});

const users = usersSnap.docs.map(d=>({
id:d.id,
...d.data()
}));

const result = Object.entries(counts)
.map(([userId,count])=>{

const user = users.find(u=>u.id===userId);

return{

name:user ? user.name : "Unknown",
count

};

})
.sort((a,b)=>b.count-a.count)
.slice(0,5);

setTopDonors(result);

});

return ()=>unsub();

},[]);

return(

<div>

<h3>🏆 Top Donors</h3>

<ul>

{topDonors.length===0 ?(

<li>No donations yet</li>

):(topDonors.map((d,i)=>(

<li key={i}>

{d.name} — {d.count} donations

</li>

)))}

</ul>

</div>

);

};

export default TopDonors;