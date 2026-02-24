export interface Member {
    name: string;
    position: string;
    email: string;
    phone?: string;
    image?: string;
    department?: string;
    id?: string;
    bloodGroup?: string;
    facebook?: string;
    linkedin?: string;
    portfolio?: string;
}

export const convenerPanel: Member[] = [
    {
        name: "Professor Dr. Fernaz Narin Nur",
        position: "Convener",
        email: "fernaz.cse@diu.edu.bd",
        phone: "01886411541",
        department: "CSE",
        image: "https://i1.rgstatic.net/ii/profile.image/11431281663681747-1759730754086_Q512/Fernaz-Nur.jpg"
    },
    {
        name: "Associate Professor Dr. Md. Akhtaruzzaman",
        position: "Co-Convener",
        email: "akhtaruzzaman.cse@diu.edu.bd",
        phone: "01754823989",
        department: "CSE",
        image: "https://faculty.daffodilvarsity.edu.bd/images/teacher/db4f56fa91ad68479a39f33538abd45d.jpg"
    },
    {
        name: "Assistant Professor Mr. Md. Hasanuzzaman Dipu",
        position: "Co-Convener",
        email: "dipu.cse@diu.edu.bd",
        phone: "01725568350",
        department: "CSE",
        image: "https://microcredentials.daffodilvarsity.edu.bd/images/expert/8a490783610399e8acb481d04230a001.png"
    }
];

export const advisingPanel: Member[] = [
    { name: "Professor Dr. Md. Fokhray Hossain", position: "Advisor", email: "drfokhray@daffodilvarsity.edu.bd", phone: "01713493250", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=800&fit=crop" },
    { name: "Professor Dr. Sheak Rashed Haider Noori", position: "Advisor", email: "drnoori@daffodilvarsity.edu.bd", phone: "01847140016", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop" },
    { name: "Professor Dr. S. M. Aminul Haque", position: "Advisor", email: "aminul.cse@daffodilvarsity.edu.bd", phone: "01847140129", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop" },
    { name: "Associate Professor Ms. Nazmun Nessa Moon", position: "Advisor", email: "moon@daffodilvarsity.edu.bd", phone: "01798145670", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop" },
    { name: "Associate Professor Dr. Arif Mahmud", position: "Advisor", email: "arif.cse@diu.edu.bd", phone: "01896034252", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop" },
    { name: "Associate Professor Dr. Abdus Sattar", position: "Advisor", email: "abdus.cse@diu.edu.bd", phone: "01818392800", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop" },
    { name: "Assistant Professor Dr. Md Alamgir Kabir", position: "Advisor", email: "kabir.cse@diu.edu.bd", phone: "01723034458", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=800&h=800&fit=crop" },
    { name: "Assistant Professor Samia Nawshin", position: "Advisor", email: "samia@daffodilvarsity.edu.bd", phone: "01915638046", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop" },
    { name: "Lecturer Mr. Mehadi Hasan", position: "Advisor", email: "mehadihasan.cse@diu.edu.bd", phone: "01521579271", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&h=800&fit=crop" },
    { name: "Lecturer Mr. Shahariar Sarkar", position: "Advisor", email: "shahariar.cse@diu.edu.bd", phone: "01624943334", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Sayeda Parvin", position: "Advisor", email: "sayeda.cse@diu.edu.bd", phone: "01318522709", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Liza Akter", position: "Advisor", email: "liza.cse@diu.edu.bd", phone: "01776477976", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Shreya Nag Riya", position: "Advisor", email: "riya.cse@diu.edu.bd", phone: "01982908767", image: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=800&h=800&fit=crop" },
    { name: "Lecturer Mr. Anup Kumar Modak", position: "Advisor", email: "anupkumar.cse@diu.edu.bd", phone: "01874066015", image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=800&h=800&fit=crop" },
    { name: "Lecturer Ms. Pallabi Biswas", position: "Advisor", email: "pallabibiswas.cse@diu.edu.bd", phone: "01993984424", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&h=800&fit=crop" },
    { name: "Mezbaul Islam Zion", position: "Advisor", email: "zion.cse@diu.edu.bd", phone: "01750458479", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=800&h=800&fit=crop" }
];

export const studentPanel: Member[] = [
    // President
    { name: "Md. Rony", position: "President", email: "rony15-4967@diu.edu.bd", phone: "01890190638", department: "CSE", id: "221-15-4967", bloodGroup: "B+", image: "https://drive.google.com/uc?export=view&id=162Hul9dyQ7rA68dw0smPqi6tvNilu046" },

    // Vice President
    { name: "Md Mobashir Hasan", position: "Vice President", email: "hasan15-5405@diu.edu.bd", phone: "01986981820", department: "CSE", id: "221-15-5405", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1ktznCbL_d2whXgyA5jF4cOR8YZYsy3YR" },

    // General Secretary
    { name: "Abid Khan", position: "General Secretary", email: "khan15-4894@diu.edu.bd", phone: "01825929393", department: "CSE", id: "221-15-4894", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1BFK_aSn3hsajqb-hqQXrvlPpqJuEW6FH" },

    // Joint Secretaries
    { name: "Md Mehedi Hasan Nayeem", position: "Joint Secretary", email: "nayeem15-5049@diu.edu.bd", phone: "01711311861", department: "CSE", id: "221-15-5049", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=1d5P73weenMh4BlyrRvDwF8dbUMrG68Ta" },

    // Organizing
    { name: "Md. Latifur Rahman Rafi", position: "Organizing Secretary", email: "latifur23105101451@diu.edu.bd", phone: "01856862093", department: "CSE", id: "0242310005101451", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=1o8Kjc8anZXrM1bZ7sVzMRiEb1Mvcp0Vf" },
    { name: "Md Minhajul Islam", position: "Joint Organizing Secretary", email: "islam2305101257@diu.edu.bd", phone: "01715904240", department: "CSE", id: "0242310005101257", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1DSoiVjYe1MXy3Juftq5Lf8UBQ_cJYeLr" },

    // Treasurer
    { name: "Md Abdur Rahman Roky", position: "Treasurer", email: "roky15-4972@diu.edu.bd", phone: "01706-959630", department: "CSE", id: "221-15-4972", bloodGroup: "B+", image: "https://drive.google.com/uc?export=view&id=1fxs4cfU19SBxO_sqEhlXX-_lUHtp6-bK" },

    // Communication
    { name: "Md. Kholilur Rahman Rabby", position: "Communication Secretary", email: "rabby15-4973@diu.edu.bd", phone: "01719019635", department: "CSE", id: "221-15-4973", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=17Pnc9tv5qQ6eWfurYpcdKIKSRPsZX8uE" },
    { name: "Anmay Paul Arpan", position: "Assistant Communication Secretary", email: "arpan2305101696@diu.edu.bd", phone: "01725590258", department: "CSE", id: "232-15-696", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1qmKlYgIAgysZnaY00ZLyyNXluCvs603Z" },

    // Press & Publication
    { name: "Md Muhasin Ali", position: "Press Secretary", email: "muhasin15-4739@diu.edu.bd", phone: "01707745849", department: "CSE", id: "221-15-4739", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=15EvIyetSAZO-jM9pi0WuVRcfCElG0sYQ" },
    { name: "Shakir Ahmed Shihab", position: "Publication Secretary", email: "ahmed241-15-203@diu.edu.bd", phone: "01889372939", department: "CSE", id: "241-15-203", bloodGroup: "B+", image: "https://drive.google.com/uc?export=view&id=1FbdJNbrx5gsgZgRbix_qjusYjmY7LAnQ" },
    { name: "Esrat Anam Kamy", position: "Assistant Publication Secretary", email: "anam241-15-445@diu.edu.bd", phone: "01970455551", department: "CSE", id: "241-15-445", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=1Dve-UfuAD2nj09v9peTv11m5vf4z9D3J" },
    { name: "MD Rezwan Ahmed Rayhan", position: "Assistant Publication Secretary", email: "rayhan241-15-901@diu.edu.bd", phone: "01937729128", department: "CSE", id: "241-15-901", bloodGroup: "B+", image: "https://drive.google.com/uc?export=view&id=1nL_o3PMafjHWoXy482G3Kuvlg72gDFA_" },
    { name: "Maria Rahman Momo", position: "Assistant Press Secretary", email: "rahman241-15-359@diu.edu.bd", phone: "01405041959", department: "CSE", id: "241-15-359", bloodGroup: "B+", image: "https://drive.google.com/uc?export=view&id=1_MK9vgToIIDTL1mAstzX4DVBauBk25Iw" },
    { name: "Kazi Hafijur Rahman Rifad", position: "Assistant Press Secretary", email: "rifad22205101873@diu.edu.bd", phone: "01851247137", department: "CSE", id: "0242220005101873", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=19KdmACPNd-h7oeF92q0uIRHrogefrO1O" },
    { name: "Asma Tabassum Nabila", position: "Assistant Media Secretary", email: "tabassum241-15-800@diu.edu.bd", phone: "01719415535", department: "CSE", id: "241-15-800", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1mnSy1E8l4zK_nEXuERR4c7nQquBCtigA" },

    // Leads & Heads
    { name: "Tamim Hossain", position: "Head of Executive", email: "hossain2305191034@diu.edu.bd", phone: "01789509447", department: "ITM", id: "232-51-034", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=1NgB61dwCN2Ru-njqhFoSOeIQq_bkpY0-" },
    { name: "Shafayat Yeamin Jian", position: "Lead Executive", email: "yeamin241-15-679@diu.edu.bd", phone: "01601721676", department: "CSE", id: "0242410005101679", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=1ihBhmtW4gGCQgQnuWm3fKY0FiZS5Hsnv" },
    { name: "Yeasin Arafat", position: "Lead Executive", email: "yeasin241-35-126@diu.edu.bd", phone: "01746163645", department: "SWE", id: "241-35-126", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1Elxj2Vt-YGOhEMpv1mFBVfKpOQV5MdjF" },
    { name: "Md.Mahathir Islam", position: "Lead Executive", email: "251-15-821@diu.edu.bd", phone: "01731724838", department: "CSE", id: "251-15-821", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1_r4M7v6IsMD7Dq8r6erA-PAa3Nmp-Pxz" },
    { name: "Shamim Faysal", position: "Lead Executive", email: "faysal241-15-016@diu.edu.bd", phone: "01798722061", department: "CSE", id: "241-15-016", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1sPN5agxT83JEdNqFhQEIeCEkX9McycBj" },

    // Designers & Developers
    { name: "Mohammad Robiul Islam", position: "Lead Creative Designer", email: "robiul241-35-321@diu.edu.bd", phone: "01518694904", department: "SWE", id: "241-35-321", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=1uQWa30la8LbxPFjeDzJw0pF5DgLRFx_Y" },
    { name: "Reduan Ahmad", position: "Web Developer", email: "ahmad2305341016@diu.edu.bd", phone: "+8801538363737", department: "SWE", id: "232-35-016", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=1ysrkUgHInxt4D9jukBm_AWjtWVKKGJch", facebook: "https://www.facebook.com/reduanahmadswe/", linkedin: "https://www.linkedin.com/in/reduanahmadswe/", portfolio: "https://www.reduanahmadswe.site/" },
    { name: "MD Robiul islam", position: "Creative Designer", email: "251-40-007@diu.edu.bd", phone: "01750970358", department: "MCT", id: "251-40-007", bloodGroup: "Ab+", image: "https://drive.google.com/uc?export=view&id=1RH4HFHAZzyfR2T9cIqQ7_XP6xgBO3ocW" },
    { name: "Tarif Hasan Samin", position: "Digital Content Creator", email: "251-15-003@diu.edu.bd", phone: "01788209907", department: "CSE", id: "251-15-003", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=1ezLSf3WDEq0IXZ1yOUmFnEEuToiFyj98" },

    // Assistant General Secretaries
    { name: "Tapon Paul", position: "Assistant General Secretary", email: "paul15-5086@diu.edu.bd", phone: "01864327175", department: "CSE", id: "221-15-5086", bloodGroup: "O+", image: "https://drive.google.com/uc?export=view&id=18ePyfuOIkkUNnvq8tBwlY1W4zOzNYZKo" },
    { name: "Md Muntaqim Meherab", position: "Assistant General Secretary", email: "meherab2305101354@diu.edu.bd", phone: "01704452423", department: "CSE", id: "232-15-354", bloodGroup: "A+", image: "https://drive.google.com/uc?export=view&id=17ygTY-Y-sy84s5hwrlRJRjkDCyIhHen3" },
    { name: "Shifat Mahmud Tonmoy", position: "Assistant General Secretary", email: "tonmoy15-6058@diu.edu.bd", phone: "01687959536", department: "CSE", id: "221-15-6058", bloodGroup: "B+", image: "https://drive.google.com/uc?export=view&id=1JDcdoHjLRxHda_WBGV60irfxmWaFHju3" },
];
