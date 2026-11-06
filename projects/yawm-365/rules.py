import sys, collections
words=collections.defaultdict(list)
for line in open(sys.argv[1],encoding='utf-8'):
    p=line.rstrip('\n').split('\t')
    if len(p)<4: continue
    s,a,w,_=(int(x) for x in p[0].split(':'))
    words[(s,a,w)].append((p[1],p[3]))
rows=[]
for loc,segs in words.items():
    stem=[f for t,f in segs if 'ROOT:يوم' in f.split('|')]
    if not stem: continue
    fs=stem[0].split('|')
    num='P' if any(x in('MP','FP','P') for x in fs) else 'D' if any(x in('MD','FD','D') for x in fs) else 'S'
    full=''.join(t for t,f in segs)
    idh='ئِذ' in full
    suff=any('SUFF' in f for t,f in segs if f!=stem[0])
    pref=any('PREF' in f for t,f in segs)
    rows.append((loc,num,idh,suff,pref,full))
T=len(rows); print('all words from root yawm:',T)
S=[r for r in rows if r[1]=='S']; print('singular (incl yawma-idhin):',len(S))
print('yawma-idhin:',sum(r[2] for r in S))
S2=[r for r in S if not r[2]]; print('singular excl yawma-idhin:',len(S2))
print('  of which pronoun-suffixed:',sum(r[3] for r in S2))
S3=[r for r in S2 if not r[3]]; print('singular, no yawma-idhin, no suffix:',len(S3))
print('  of which with prefix (wa/fa/bi/li, not al):',sum(r[4] for r in S3))
print('plural ayyam:',sum(r[1]=='P' for r in rows),' dual:',sum(r[1]=='D' for r in rows))
print('distinct verses with singular-no-idh-no-suff:',len({r[0][:2] for r in S3}))
