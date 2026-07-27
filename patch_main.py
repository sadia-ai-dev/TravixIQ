import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

main_pattern = re.compile(r'<main className="flex-grow p-6 relative z-10 max-w-7xl w-full mx-auto pb-24 md:pb-8">.*?<TransitionProvider key=\{activeTab\}>.*?</TransitionProvider>.*?</main>', re.DOTALL)

new_main = """<main className="flex-grow p-6 relative z-10 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          <TransitionProvider key={activeTab}>
            <Routes location={location}>
              <Route path="/dashboard" element={
                <Dashboard 
                  currentDestination={destination}
                  activeTrip={activeTrip}
                  profile={profile}
                  onNavigate={(path) => navigate('/' + path)}
                  onUpdateGoals={handleUpdateGoals}
                />
              } />
              <Route path="/planner" element={
                <TravelPlanner 
                  destination={destination}
                  onSetDestination={setDestination}
                  activeTrip={activeTrip}
                  onSetActiveTrip={setActiveTrip}
                  onSaveTrip={handleSaveTrip}
                />
              } />
              <Route path="/pulse" element={
                <TravelPulse 
                  destination={destination}
                  pulseData={pulseData}
                  onSetPulseData={setPulseData}
                />
              } />
              <Route path="/budget" element={
                <BudgetOptimizer 
                  destination={destination}
                  budgetData={budgetData}
                  onSetBudgetData={setBudgetData}
                />
              } />
              <Route path="/scam-shield" element={
                <ScamShield 
                  destination={destination}
                  scamData={scamData}
                  onSetScamData={setScamData}
                />
              } />
              <Route path="/muslim" element={
                <MuslimAssistant 
                  destination={destination}
                  muslimData={muslimData}
                  onSetMuslimData={setMuslimData}
                />
              } />
              <Route path="/profile" element={
                <Profile 
                  profile={profile}
                  onUpdateAvatar={handleUpdateAvatar}
                  onUpdateName={handleUpdateName}
                />
              } />
              <Route path="/settings" element={
                <SettingsComponent 
                  preferences={profile.preferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  onResetApp={handleResetApp}
                  profileData={profile}
                />
              } />
            </Routes>
          </TransitionProvider>
        </main>"""

content = main_pattern.sub(new_main, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

