import json,sys,re,collections
d=json.load(open(sys.argv[1],encoding='utf-8'))['data']['surahs']
c=collections.Counter()
for s in d:
    for a in s['ayahs']:
        t=a['text']
        if a['numberInSurah']==1 and s['number'] not in (1,9):
            t=' '.join(t.split()[4:])
        for w in t.split():
            if 'يوم' in w: c[w]+=1
tot=sum(c.values())
idh=sum(v for k,v in c.items() if 'ئذ' in k)
dual=sum(v for k,v in c.items() if 'يومين' in k)
suff=sum(v for k,v in c.items() if re.search(r'يوم(كم|هم|ه|نا|ها)$',k))
other=[(k,v) for k,v in c.items() if not ('ئذ' in k or 'يومين' in k or re.search(r'يوم(كم|هم|ه|نا|ها)$',k))]
print('tokens containing يوم:',tot,'idh',idh,'dual',dual,'suff',suff,'remaining',tot-idh-dual-suff)
for k,v in sorted(c.items(),key=lambda x:-x[1]): print(k,v)
